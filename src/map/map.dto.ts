import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum MAP_TYPE {
  PROVINCE = 'p',
  DISTRICT = 'd',
  WARD = 'w',
  DEPTH = 'api',
}

export class GetMapDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  depth: string;
}
