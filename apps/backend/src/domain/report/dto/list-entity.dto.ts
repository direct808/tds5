import { PickType } from '@nestjs/swagger'
import { GetReportDto } from './get-report.dto'

export class ListEntityDto extends PickType(GetReportDto, [
  'metrics',
  'sortField',
  'sortOrder',
  'offset',
  'limit',
  'timezone',
  'rangeInterval',
  'rangeFrom',
  'rangeTo',
]) {}
