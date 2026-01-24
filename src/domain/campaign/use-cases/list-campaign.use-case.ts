import { Injectable } from '@nestjs/common'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report/get-report.use-case'
import { ListCampaignDto } from '@/domain/campaign/dto/list-campaign.dto'
import {
  FilterOperatorEnum,
  InputFilterData,
  ReportResponse,
} from '@/domain/report/types'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { CampaignModel } from '@generated/prisma/models/Campaign'
import { filterNotNullable } from '@/shared/helpers'

@Injectable()
export class ListCampaignUseCase {
  constructor(
    private readonly getReportUseCase: GetReportUseCase,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async handle(
    args: ListCampaignDto,
    userId: string,
  ): Promise<ReportResponse> {
    const hasFilter = args.filter.length > 0
    const campaigns = await this.campaignRepository.list(args, userId)
    const ids = campaigns.map((item) => item.id)

    const report = await this.getReport(args, ids)

    const rowsConcat = this.concat(campaigns, report.rows, hasFilter)

    const rowsPaginated = this.applyPagination(args, rowsConcat)

    return { rows: rowsPaginated, summary: report.summary, total: report.total }
  }

  private concat(
    campaigns: CampaignModel[],
    rows: Record<string, string>[],
    hasFilter: boolean,
  ): Record<string, string>[] {
    if (hasFilter) {
      const campaignsMap = new Map(
        campaigns.map((campaign) => [campaign.id, campaign]),
      )

      const rowsPrepared = rows.map((row) => {
        if (!row.campaignId) {
          throw new Error('No campaignId')
        }
        const campaign = campaignsMap.get(row.campaignId)

        if (!campaign) {
          return null
        }
        row.name = campaign.name

        return row
      })

      return filterNotNullable(rowsPrepared)
    } else {
      const rowsMap = new Map(rows.map((item) => [item.campaignId!, item]))

      return campaigns.map((campaign) => {
        const campaignData = { id: campaign.id, name: campaign.name }
        const row = rowsMap.get(campaign.id)
        if (!row) {
          return campaignData
        }
        const { campaignId, ...rowWithoutCampaignId } = row

        return { ...campaignData, ...rowWithoutCampaignId }
      })
    }
  }

  private async getReport(
    args: ListCampaignDto,
    campaignIds: string[],
  ): Promise<ReportResponse> {
    const filter: InputFilterData[] = [
      ...args.filter.filter((item) => item[0] !== 'campaignId'),
      ['campaignId', FilterOperatorEnum.in, campaignIds],
    ]

    return this.getReportUseCase.handle(
      {
        ...args,
        groups: ['campaignId'],
        filter,
      },
      campaignIds,
    )
  }

  private applyPagination(
    args: ListCampaignDto,
    rows: Record<string, string>[],
  ): Record<string, string>[] {
    return rows
  }
}
