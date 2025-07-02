import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { SelectStreamService } from './select-stream.service'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { HandleStreamService } from './handle-stream.service'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { ClickContext, StreamResponse } from './types'
import { RegisterClickService } from './register-click.service'
import { SetupSubject } from '@/click/observers/setup-subject'

@Injectable()
export class ClickService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
    private readonly registerClickService: RegisterClickService,
    private readonly setupSubject: SetupSubject,
  ) {}

  async handleClick(cContext: ClickContext) {
    await this.setupSubject.setupRequestSubject(cContext)
    const streamResponse = await this.getStreamResponse(cContext)
    this.responseHandlerFactory.handle(cContext, streamResponse)
  }

  public async getStreamResponse(
    cContext: ClickContext,
  ): Promise<StreamResponse> {
    const { code, clickData } = cContext
    this.checkIncrementRedirectCount(cContext)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)
    stream.campaign = campaign

    await this.setupSubject.setupStreamSubject(clickData, stream)

    const streamResponse = await this.handleStreamService.handleStream(
      stream,
      cContext,
    )

    if ('url' in streamResponse && !clickData.destination) {
      clickData.destination = streamResponse.url
    }

    await this.registerClickService.register(clickData)

    return streamResponse
  }

  private async getFullCampaignByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new NotFoundException('No campaign')
    }

    return campaign
  }

  private checkIncrementRedirectCount(cContext: ClickContext) {
    cContext.redirectCount++
    if (cContext.redirectCount > 5) {
      throw new HttpException('To many redirects', HttpStatus.BAD_REQUEST)
    }
  }
}
