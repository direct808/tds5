import { Injectable } from '@nestjs/common'
import { ClickData } from '@/click/click-data'
import { ClickObserver } from '@/click/observers/subject'
import { ClickContextService } from '@/click/click-context.service'

@Injectable()
export class QueryStringObserver implements ClickObserver<void> {
  constructor(private readonly clickContext: ClickContextService) {}

  public async handle() {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    const data: ClickData = {
      ip: request.ip,

      referer: request.header('referer'),
      userAgent: request.header('user-agent'),

      keyword: request.query('keyword'),
      source: request.query('source'),
      cost: this.getCost(request.query('cost')),
      externalId: request.query('external_id'),
      creativeId: request.query('creative_id'),
      adCampaignId: request.query('ad_campaign_id'),

      extraParam1: request.query('extra_param_1'),
      extraParam2: request.query('extra_param_2'),

      subId1: request.query('sub_id_1'),
      subId2: request.query('sub_id_2'),
    }

    Object.assign(clickData, data)
  }

  private getCost(val: string | undefined) {
    let costStr = val
    costStr = costStr ? costStr.replace(',', '.') : costStr
    const costRaw = costStr ? parseFloat(costStr) : undefined
    return Number.isNaN(costRaw) ? undefined : costRaw
  }
}
