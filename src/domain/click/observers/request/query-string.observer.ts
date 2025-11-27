import { Inject, Injectable } from '@nestjs/common'
import { ClickData } from '@/domain/click/click-data'
import { ClickObserver } from '@/domain/click/observers/subject'
import {
  ClickContext,
  IClickContext,
} from '@/domain/click/shared/click-context.service'
import { RequestAdapter } from '@/shared/request-adapter'
import { Decimal } from '../../../../../generated/prisma/internal/prismaNamespace'

@Injectable()
export class QueryStringObserver implements ClickObserver {
  constructor(
    @Inject(ClickContext) private readonly clickContext: IClickContext,
  ) {}

  public handle(): void {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    const data: ClickData = {
      ip: request.ip ?? null,

      referer: this.getQuery(request, 'referer'),
      userAgent: this.getQuery(request, 'user-agent'),

      keyword: this.getQuery(request, 'keyword'),
      source: this.getQuery(request, 'source'),
      cost: this.getCost(request.query('cost')),
      externalId: this.getQuery(request, 'external_id'),
      creativeId: this.getQuery(request, 'creative_id'),
      adCampaignId: this.getQuery(request, 'ad_campaign_id'),

      extraParam1: this.getQuery(request, 'extra_param_1'),
      extraParam2: this.getQuery(request, 'extra_param_2'),

      subId1: this.getQuery(request, 'sub_id_1'),
      subId2: this.getQuery(request, 'sub_id_2'),
    } as ClickData

    Object.assign(clickData, data)
  }

  getQuery(request: RequestAdapter, name: string): string | null {
    return request.query(name) ?? null
  }

  private getCost(val: string | undefined): Decimal | null {
    let costStr = val
    costStr = costStr ? costStr.replace(',', '.') : costStr
    const costRaw = costStr ? Decimal(parseFloat(costStr)) : null

    return Number.isNaN(costRaw) ? null : costRaw
  }
}
