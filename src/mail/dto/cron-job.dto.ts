import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CronJobDto {
  @ApiProperty()
  @IsNumber()
  minute: number;

  @ApiProperty()
  @IsNumber()
  hour: number;
}
