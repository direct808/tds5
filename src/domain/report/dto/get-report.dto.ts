import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { Direction } from '@/domain/report/types'

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
  sortOrder: Direction = Direction.asc
}
