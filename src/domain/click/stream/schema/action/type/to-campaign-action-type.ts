import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '@/domain/click/types'
import { ClickContext } from '@/domain/click/shared/click-context.service'
import { StreamGetPayload } from '@generated/prisma/models/Stream'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContext) {}

  handle({
    actionCampaign,
  }: StreamGetPayload<{ include: { actionCampaign: true } }>): StreamResponse {
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
