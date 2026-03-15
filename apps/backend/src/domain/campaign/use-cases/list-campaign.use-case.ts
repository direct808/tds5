import { Injectable } from '@nestjs/common'
import { ListCampaignDto } from '@/domain/campaign/dto/list-campaign.dto'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Injectable()
export class ListCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListCampaignDto,
    userId: string,
  ): Promise<ReportResponseDto> {
    const campaigns = await this.campaignRepository.list(userId)

    return this.entityReportUseCase.execute(args, campaigns, 'campaignId')
  }
}
