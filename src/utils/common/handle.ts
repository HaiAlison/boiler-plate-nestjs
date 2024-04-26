import { HttpException, HttpStatus } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DEFAULT_LIMIT_NUMBER, DEFAULT_PAGE_NUMBER } from './constant';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { PaginationResponse } from './interface';
import axios, {AxiosError, Method} from 'axios';
import axiosRetry from 'axios-retry';
import { pickBy } from 'lodash';

export const handleError = (e) => {
  if (new RegExp('Could not find any entity of type').test(e.message))
    throw new HttpException(
      e.message.match(/".*"/)[0]?.replace(/"/g, '') + ' not found',
      HttpStatus.BAD_REQUEST,
      {
        cause: new Error(
          e.message.match(/".*"/)[0]?.replace(/"/g, '') + ' not found',
        ),
      },
    );
  if (e instanceof AxiosError) {
    throw new HttpException(e.response?.data || e, HttpStatus.BAD_REQUEST, {
      cause: new Error(e.response?.data || e),
    });
  }
  if (new RegExp('violates not-null constraint').test(e.message)) {
    throw new HttpException(
      'column ' +
        e.message.match(/".*"/)[0]?.replace(/"/g, '') +
        ' can not be null',
      HttpStatus.BAD_REQUEST,
      {
        cause: new Error(
          e.message.match(/".*"/)[0]?.replace(/"/g, '') + ' not found',
        ),
      },
    );
  }
  console.error(e);
  if (e.message?.includes('unique constraint'))
    throw new HttpException(e.detail, HttpStatus.BAD_REQUEST, {
      cause: new Error(e.detail),
    });
  throw new HttpException(e, HttpStatus.BAD_REQUEST, {
    cause: new Error(e.detail),
  });
};

export const removeUnicode = (str: string): string => {
  if (!str) return;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/ + /g, ' ');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|]|~|$|_/g,
    '',
  );
  str = str.replace(/-+-/g, ''); //thay thế 2- thành 1-
  str = str.replace(/^-+|-+$/g, '');
  return str;
};

export const pagination = async (
  query?: SelectQueryBuilder<any> | Repository<any>,
  options?: {
    limit?: number;
    offset?: number;
    getRaw?: boolean;
    getAll?: boolean;
  },
  findManyOptions?: FindManyOptions | FindOptionsWhere<any>,
  otherParams?: any,
): Promise<PaginationResponse<any>> => {
  const {
    limit = DEFAULT_LIMIT_NUMBER,
    offset = DEFAULT_PAGE_NUMBER,
    getRaw,
    getAll,
  } = options || {};
  let results, totalItems;
  const skip = (offset - 1) * limit;
  if (query instanceof SelectQueryBuilder) {
    if (getAll) query.take(limit).skip(skip);
    if (getRaw) {
      results = await query.getRawMany();
      totalItems = results.length;
    } else {
      [results, totalItems] = await query
        .take(limit)
        .skip(skip)
        .getManyAndCount();
    }
  } else {
    [results, totalItems] = await query.findAndCount({
      ...findManyOptions,
      take: limit,
      skip,
      order: {},
    });
  }

  return {
    ...otherParams,
    results,
    offset,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

export const parseTextToArray = (text, toNumber = false) => {
  if (text === '') {
    return [];
  }
  if (/^\[.*?]$/.test(text)) {
    try {
      return JSON.parse(text);
    } catch (error) {
      text = text.replace(/^\[|]$/g, '');
    }
  }
  const result: (string | number)[] =
    typeof text == 'object' ? text : text.replace(/\s/g, '').split(',');

  if (toNumber) {
    for (let i = 0; i < result.length; i++) {
      if (/\d+/.test(result[i] as string)) {
        result[i] = +result[i];
      }
    }
  }
  console.log(result);
  return result;
};

axiosRetry(axios, { retries: 3 });

export const callAxios = async (
  method: Method,
  url,
  data = {},
  headers = {},
) => {
  try {
    return await axios.request({
      url,
      method,
      data,
      headers,
    });
  } catch (e) {
    return handleError(e);
  }
};

export const cleanObject = (originalObject = {}) => {
  const validArrays = pickBy(
      originalObject,
      (e) => Array.isArray(e) && e.length > 0,
    ),
    validObjects = pickBy(
      originalObject,
      (e) =>
        e !== undefined &&
        e !== null &&
        e !== '' &&
        !Array.isArray(e) &&
        typeof e === 'object' &&
        Object.keys(e).length > 0,
    ),
    validProperties = pickBy(
      originalObject,
      (e) =>
        e !== undefined &&
        e !== null &&
        e !== '' &&
        !Array.isArray(e) &&
        typeof e !== 'object',
    );
  return { ...validProperties, ...validArrays, ...validObjects };
};

export const generateCodeBaseOnSequence = async (
  table_name,
  prefix,
  num_digits,
  transaction: DeepPartial<any>,
): Promise<string> => {
  let code;
  do {
    const [sequence_code] = await transaction.query(
      `SELECT generate_code($1,$2,$3) as code;`,
      [prefix, num_digits, table_name],
    );
    const [max_code] = await transaction.query(
      `select max(code) as code from public.${table_name} where code ilike $1`,
      ['%' + prefix + '%'],
    );
    if (
      sequence_code.code &&
      Number(sequence_code.code.match(/\d+/g).join('')) <=
        Number(max_code.code?.match(/\d+/g).join(''))
    ) {
      await transaction.query(
        `select max(code) as code from public.${table_name} where code ilike $1`,
        ['%' + prefix + '%'],
      );
    } else {
      code = sequence_code.code;
    }
  } while (!code);
  console.log(code);
  return code;
};

export const fromToQuery = ({ from, to, tableName, field, query }) => {
  if (from && to) {
    query.andWhere(`(${tableName}.${field} between :from and :to)`, {
      from,
      to,
    });
  } else if (from) {
    query.andWhere(`(${tableName}.${field} >= :from)`, { from });
  } else if (to) {
    query.andWhere(`(${tableName}.${field} <= :to)`, { to });
  }
};
