import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class UserDto {
  @ApiPropertyOptional()
  @IsDateString()
  date: Date;
}
