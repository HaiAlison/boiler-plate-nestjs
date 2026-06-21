import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class UserDto {
  @ApiPropertyOptional()
  @IsDateString()
  date: Date;
}

@InputType()
export class CreateUserDto {
  @Field()
  @ApiProperty()
  readonly code: string;

  @Field()
  @ApiProperty()
  readonly name: string;

  @Field()
  @ApiProperty()
  readonly address: string;
} 