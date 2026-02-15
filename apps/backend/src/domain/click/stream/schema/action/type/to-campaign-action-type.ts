import { Injectable } from '@nestjs/common'
import { ActionType } from '../../../../types'
import { ClickContext } from '../../../../shared/click-context.service'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(private readonly clickContext: ClickContext) {}

  handle: ActionType['handle'] = ({ actionCampaign }) => {
    if (actionCampaign === null) {
      throw new Error('No actionCampaign')
    }

    const clickData = this.clickContext.getClickData()

    clickData.destination = actionCampaign.name

    return {
      campaignCode: actionCampaign.code,
    }
  }
}
