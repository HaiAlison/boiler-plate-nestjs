import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSenderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly first_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
