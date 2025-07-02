import { Injectable } from '@nestjs/common'
import { ClickData } from '@/click/click-data'
import { ClickObserver, RequestObserverData } from '@/click/observers/subject'

@Injectable()
export class QueryStringObserver implements ClickObserver<RequestObserverData> {
  public async handle({ request, clickData }: RequestObserverData) {
    const data: ClickData = {
      ip: request.ip,

      referer: request.headers.referer,
      userAgent: request.headers['user-agent'],

      keyword: this.toOptionalString(request.query.keyword),
      source: this.toOptionalString(request.query.source),
      cost: this.getCost(request.query.cost),
      externalId: this.toOptionalString(request.query.external_id),
      creativeId: this.toOptionalString(request.query.creative_id),
      adCampaignId: this.toOptionalString(request.query.ad_campaign_id),

      extraParam1: this.toOptionalString(request.query.extra_param_1),
      extraParam2: this.toOptionalString(request.query.extra_param_2),

      subId1: this.toOptionalString(request.query.sub_id_1),
      subId2: this.toOptionalString(request.query.sub_id_2),
    }

    Object.assign(clickData, data)
  }

  private getCost(val: unknown) {
    let costStr = this.toOptionalString(val)
    costStr = costStr ? costStr.replace(',', '.') : costStr
    const costRaw = costStr ? parseFloat(costStr) : undefined
    return Number.isNaN(costRaw) ? undefined : costRaw
  }

  private toOptionalString(val: unknown): string | undefined {
    if (typeof val === 'string') {
      return val
    }
  }
}
