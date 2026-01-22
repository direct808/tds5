import { OmitType } from '@nestjs/swagger'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'

export class ListCampaignDto extends OmitType(GetReportDto, ['groups']) {}
