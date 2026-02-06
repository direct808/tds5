import { Injectable } from '@nestjs/common'
import { ListCampaignDto } from '@/domain/campaign/dto/list-campaign.dto'
import { ReportResponse } from '@/domain/report/types'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'

@Injectable()
export class ListCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListCampaignDto,
    userId: string,
  ): Promise<ReportResponse> {
    const campaigns = await this.campaignRepository.list(userId)

    return this.entityReportUseCase.execute(args, campaigns, 'campaignId')
  }
}
