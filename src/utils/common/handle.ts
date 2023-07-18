import { HttpException, HttpStatus } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DEFAULT_LIMIT_NUMBER, DEFAULT_PAGE_NUMBER } from './constant';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { PaginationResponse } from './interface';
import axios, { Method } from 'axios';
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
      order:{}
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

export const sendPost = async (method: Method, url, data, headers = {}) => {
  try {
    return await axios.request({
      url,
      method,
      data,
      headers,
    });
  } catch (e) {
    console.error(e.message);
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

export const generateCode = async (
  prefix: string | number,
  entityName: string,
  dataSource: DataSource,
  conditions,
  maxLength: number,
  field = 'code',
) => {
  const columns = [],
    params = [];
  Object.entries(conditions).forEach(([key, val], index) => {
    index += 1;
    columns.push(`${key} = $${index} `);
    params.push(val);
  });

  const result = await dataSource.query(
    `select MAX(${field}) as max_code from ${entityName} where ${columns.join(
      'and ',
    )}`,
    params,
  );

  let isMatched = true,
    code,
    num = parseInt(result[0].max_code?.substring((prefix + '').length) || 0);
  do {
    code = prefix + (num += 1).toString().padStart(maxLength, '0');
    isMatched = !!(
      await dataSource.query(
        `select count(*)::int from ${entityName} where ${columns.join(
          'and ',
        )} and ${field} = $${params.length + 1}`,
        [...params, code],
      )
    )[0].count;
  } while (isMatched);
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
