import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '@/click/types'
import { ClickService } from '@/click/click.service'
import { Stream } from '@/campaign/entity/stream.entity'

@Injectable()
export class ToCampaignActionType implements ActionType {
  constructor(
    @Inject(forwardRef(() => ClickService))
    private readonly clickService: ClickService,
  ) {}

  async handle({ actionCampaign }: Stream): Promise<StreamResponse> {
    if (!actionCampaign) {
      throw new Error('No actionCampaign')
    }
    const nextClickData = structuredClone(cRequest.clickData)

    nextClickData.previousCampaignId = cRequest.clickData.campaignId
    cRequest.clickData.destination = actionCampaign.name

    return this.clickService.getStreamResponse(actionCampaign.code)
  }
}
