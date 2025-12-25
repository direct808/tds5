import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { Direction, InputFilterData } from '@/domain/report/types'
import { Transform, TransformFnParams } from 'class-transformer'

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

  @Transform(transformFilter)
  @IsArray()
  @IsArray({ each: true })
  @ArrayMinSize(3, { each: true })
  @ArrayMaxSize(3, { each: true })
  filter: InputFilterData[] = []

  @Min(0)
  @IsInt()
  @Transform(({ value }) => (value ? +value : value))
  offset: number = 0

  @IsPositive()
  @IsInt()
  @Transform(({ value }) => (value ? +value : value))
  @Max(1000)
  declare limit: number
}

function transformFilter({ value }: TransformFnParams): object {
  if (typeof value !== 'string') {
    return value
  }

  return JSON.parse(value)
}
