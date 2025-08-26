import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '@/click/types'
import { Stream } from '@/campaign/entity/stream.entity'
import { ClickContext } from '@/click/shared/click-context.service'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContext) {}

  handle({ actionCampaign }: Stream): StreamResponse {
    if (!actionCampaign) {
      throw new Error('No actionCampaign')
    }

    const clickData = this.clickContext.getClickData()

    clickData.destination = actionCampaign.name

    return {
      campaignCode: actionCampaign.code,
    }
  }
}
