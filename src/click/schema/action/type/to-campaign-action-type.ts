import { Injectable } from '@nestjs/common'
import { ActionType, ClickContext, StreamResponse } from '@/click/types'
import { Stream } from '@/campaign/entity/stream.entity'

@Injectable()
export class ToCampaignActionType implements ActionType {
  async handle(
    { actionCampaign }: Stream,
    { clickData }: ClickContext,
  ): Promise<StreamResponse> {
    if (!actionCampaign) {
      throw new Error('No actionCampaign')
    }

    clickData.destination = actionCampaign.name

    return {
      campaignCode: actionCampaign.code,
    }
  }
}
