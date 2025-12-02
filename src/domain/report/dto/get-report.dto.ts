import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { Direction } from '@/domain/report/types'
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
  filter: string[][] = []
}

function transformFilter({ value }: TransformFnParams): object {
  if (typeof value !== 'string') {
    return value
  }

  const obj = JSON.parse(value)

  return obj //.map(transformFilterItem)
}
