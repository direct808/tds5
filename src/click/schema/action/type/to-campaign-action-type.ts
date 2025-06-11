import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ActionType, ClickContext, StreamResponse } from '../../../types'
import { ClickService } from '../../../click.service'
import { Stream } from '../../../../campaign/entity/stream.entity'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(
    @Inject(forwardRef(() => ClickService))
    private readonly clickService: ClickService,
  ) {}

  async handle(
    { actionCampaign, campaign }: Stream,
    cRequest: ClickContext,
  ): Promise<StreamResponse> {
    if (!actionCampaign) {
      throw new Error('No actionCampaign')
    }
    // const currentClickData = cRequest.clickData
    const nextClickData = structuredClone(cRequest.clickData)

    nextClickData.previousCampaignId = cRequest.clickData.campaignId
    cRequest.clickData.destination = campaign.name

    return this.clickService.getStreamResponse({
      ...cRequest,
      code: actionCampaign.code,
      clickData: nextClickData,
    })
  }
}
