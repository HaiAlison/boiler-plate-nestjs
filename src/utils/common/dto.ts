import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { AsIntDefaultValue } from './common.decorator';
import { DEFAULT_LIMIT_NUMBER, DEFAULT_PAGE_NUMBER } from './constant';
import { Expose, Transform } from 'class-transformer';
import { removeUnicode } from './handle';

export class CommonDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE_NUMBER })
  @AsIntDefaultValue(DEFAULT_PAGE_NUMBER)
  @Expose()
  readonly offset?: number;

  @ApiPropertyOptional({ default: DEFAULT_LIMIT_NUMBER })
  @AsIntDefaultValue(DEFAULT_LIMIT_NUMBER)
  @Expose()
  readonly limit?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Expose()
  @Transform(({ value }) => value && '%' + removeUnicode(value).trim() + '%')
  search_string?: string;
}

export class FromToCommonDto extends CommonDto {
  @ApiPropertyOptional({
    type: Date,
    format: 'ISOString',
    example: new Date().toISOString(),
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  // @Transform(({ obj }) => {
  //   return new Date(new Date(obj.from).toUTCString()).toISOString();
  // })
  from?: Date;

  @ApiPropertyOptional({
    type: Date,
    format: 'ISOString',
    example: new Date().toISOString(),
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  // @Transform(({ obj }) => {
  //   return new Date(new Date(obj.to).toUTCString()).toISOString();
  // })
  to?: Date;
}
