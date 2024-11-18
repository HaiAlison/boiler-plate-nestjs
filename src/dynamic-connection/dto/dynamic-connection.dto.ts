import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateDynamicConnectionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  database: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateDynamicConnectionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  database: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;
}