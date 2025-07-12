import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '@/click/types.js'
import { Stream } from '@/campaign/entity/stream.entity.js'
import { ClickContext } from '@/click/shared/click-context.service.js'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContext) {}

  async handle({ actionCampaign }: Stream): Promise<StreamResponse> {
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
