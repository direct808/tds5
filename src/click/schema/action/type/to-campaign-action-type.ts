import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ActionType, StreamResponse } from '../../../types'
import { ClickService } from '../../../click.service'
import { Stream } from '../../../../campaign/entity/stream.entity'

// const MAX_REDIRECTS = 1

@Injectable()
export class ToCampaignActionType implements ActionType {
  private redirectCount = 0

  constructor(private readonly clickService: ClickService) {}

  async handle(stream: Stream): Promise<StreamResponse> {
    if (!stream.actionCampaignId) {
      throw new Error('No actionCampaignId')
    }

    // if (this.redirectCount >= MAX_REDIRECTS) {
    //   // todo вывести это в браузер
    //   throw new Error('To many redirects')
    // }

    const campaign = await this.getCampaignById(data.actionCampaignId)
    this.redirectCount++
    console.log('To campaign', campaign, 'redirectCount', this.redirectCount)

    return this.clickService.addByCampaign(campaign, clickData)
  }

  private async getCampaignById(id: string) {
    const { campaign } = await this.foreignService.getCampaignFull({ id })

    if (!campaign) {
      throw new NotFoundException('No campaign found')
    }

    return campaign
  }
}
