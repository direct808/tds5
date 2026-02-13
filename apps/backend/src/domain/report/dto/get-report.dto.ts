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

export class GetReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  metrics: string[] = []

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  groups: string[] = []

  @IsString()
  @IsOptional()
  declare sortField?: string

  @IsEnum(Direction)
  @IsOptional()
  declare sortOrder?: Direction

  @Transform(transformJson)
  @IsArray()
  @IsArray({ each: true })
  @ArrayMinSize(3, { each: true })
  @ArrayMaxSize(3, { each: true })
  filter: InputFilterData[] = []

  @Min(0)
  @IsInt()
  @Transform(({ value }) => (!isNullable(value) ? +value : value))
  offset: number = 0

  @IsPositive()
  @IsInt()
  @Transform(({ value }) => (!isNullable(value) ? +value : value))
  @Max(1000)
  declare limit: number

  @IsTimeZone()
  declare timezone: string

  @IsEnum(ReportRangeEnum)
  declare rangeInterval: ReportRangeEnum

  @IsDateString()
  @IsOptional()
  declare rangeFrom?: string

  @IsDateString()
  @IsOptional()
  declare rangeTo?: string
}

function transformJson({ value }: TransformFnParams): object {
  if (typeof value !== 'string') {
    return value
  }

  return JSON.parse(value)
}
