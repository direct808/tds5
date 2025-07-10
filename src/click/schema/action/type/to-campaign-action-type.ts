import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '@/click/types'
import { Stream } from '@/campaign/entity/stream.entity'
import { ClickContextService } from '@/click/shared/click-context.service'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContextService) {}

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
