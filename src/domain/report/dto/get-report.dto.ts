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

// export enum OperatorNumeric {
//   equal = '=',
//   notEqual = '<>',
//   lessThen = '<',
//   greaterThen = '>',
// }

// class FilterNumeric {
//   @IsString()
//   type = 'numeric' as const
//
//   @IsString()
//   declare field: string
//
//   @IsEnum(OperatorNumeric)
//   declare operator: OperatorNumeric
//
//   @IsNumber()
//   declare value: number
// }

// export class FilterBoolean {
//   @IsString()
//   type = 'boolean' as const
//
//   @IsString()
//   declare field: string
//
//   @IsBoolean()
//   declare value: boolean
// }

// export type FilterDto = FilterNumeric | FilterBoolean

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

// function transformFilterItem(item: FilterDto): object {
//   switch (item.type) {
//     case 'numeric':
//       return plainToInstance(FilterNumeric, item)
//     case 'boolean':
//       return plainToInstance(FilterBoolean, item)
//   }
//
//   // @ts-ignore
//   throw new BadRequestException(`Unknown type: ${item.type}`)
// }
