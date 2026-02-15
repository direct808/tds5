import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsTimeZone,
  Max,
  Min,
} from 'class-validator'
import { Direction, InputFilterData, ReportRangeEnum } from '../types'
import { Transform, TransformFnParams } from 'class-transformer'
import { isNullable } from '@/shared/helpers'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty()
  metrics: string[] = []

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional()
  groups: string[] = []

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  declare sortField?: string

  @IsEnum(Direction)
  @IsOptional()
  @ApiPropertyOptional()
  declare sortOrder?: Direction

  @Transform(transformJson)
  @IsArray()
  @IsArray({ each: true })
  @ArrayMinSize(3, { each: true })
  @ArrayMaxSize(3, { each: true })
  @ApiPropertyOptional()
  filter: InputFilterData[] = []

  @Min(0)
  @IsInt()
  @Transform(({ value }) => (!isNullable(value) ? +value : value))
  @ApiPropertyOptional()
  offset: number = 0

  @IsPositive()
  @IsInt()
  @Transform(({ value }) => (!isNullable(value) ? +value : value))
  @Max(1000)
  @ApiPropertyOptional()
  declare limit: number

  @IsTimeZone()
  @ApiProperty()
  declare timezone: string

  @IsEnum(ReportRangeEnum)
  @ApiProperty()
  declare rangeInterval: ReportRangeEnum

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  declare rangeFrom?: string

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  declare rangeTo?: string
}

function transformJson({ value }: TransformFnParams): object {
  if (typeof value !== 'string') {
    return value
  }

  return JSON.parse(value)
}
