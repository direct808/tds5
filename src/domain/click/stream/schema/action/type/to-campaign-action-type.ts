import { Injectable } from '@nestjs/common'
import { ActionType } from '@/domain/click/types'
import { ClickContext } from '@/domain/click/shared/click-context.service'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContext) {}

  handle: ActionType['handle'] = ({ actionCampaign }) => {
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
