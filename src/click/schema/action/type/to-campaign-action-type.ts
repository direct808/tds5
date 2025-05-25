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
    { actionCampaign }: Stream,
    cRequest: ClickContext,
  ): Promise<StreamResponse> {
    if (!actionCampaign) {
      throw new Error('No actionCampaign')
    }

    return this.clickService.getStreamResponse({
      ...cRequest,
      code: actionCampaign.code,
    })
  }
}
