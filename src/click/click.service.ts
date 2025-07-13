import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CampaignRepository } from '../campaign/campaign.repository.js'
import { SelectStreamService } from './select-stream.service.js'
import { Campaign } from '../campaign/entity/campaign.entity.js'
import { HandleStreamService } from './handle-stream.service.js'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory.js'
import { StreamResponse } from './types.js'
import { RegisterClickService } from './register-click.service.js'
import { SetupSubject } from './observers/setup-subject.js'
import { ClickContext } from './shared/click-context.service.js'

type RedirectData = { count: number }

@Injectable()
export class ClickService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
    private readonly registerClickService: RegisterClickService,
    private readonly setupSubject: SetupSubject,
    private readonly clickContext: ClickContext,
  ) {}

  async handleClick(code: string) {
    await this.setupSubject.setupRequestSubject()
    const redirectData: RedirectData = { count: 0 }
    const streamResponse = await this.getStreamResponse(code, redirectData)
    this.responseHandlerFactory.handle(streamResponse)
  }

  public async getStreamResponse(
    code: string,
    redirectData: RedirectData,
  ): Promise<StreamResponse> {
    const clickData = this.clickContext.getClickData()

    this.checkIncrementRedirectCount(redirectData)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)
    stream.campaign = campaign

    await this.setupSubject.setupStreamSubject(stream)

    const streamResponse = await this.handleStreamService.handleStream(stream)

    if ('url' in streamResponse) {
      clickData.destination = streamResponse.url
    }

    await this.registerClickService.register(clickData)

    if ('campaignCode' in streamResponse) {
      clickData.previousCampaignId = campaign.id
      return this.getStreamResponse(streamResponse.campaignCode, redirectData)
    }

    return streamResponse
  }

  private async getFullCampaignByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new NotFoundException('No campaign')
    }

    return campaign
  }

  private checkIncrementRedirectCount(redirectData: RedirectData) {
    redirectData.count++
    if (redirectData.count > 5) {
      throw new HttpException('To many redirects', HttpStatus.BAD_REQUEST)
    }
  }
}
