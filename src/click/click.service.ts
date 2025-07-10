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
import { StreamResponse } from './types'
import { RegisterClickService } from './register-click.service'
import { SetupSubject } from '@/click/observers/setup-subject'
import { ClickContextService } from '@/click/click-context.service'

type RedirectData = {
  count: number
}

@Injectable()
export class ClickService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
    private readonly registerClickService: RegisterClickService,
    private readonly setupSubject: SetupSubject,
    private readonly clickContext: ClickContextService,
  ) {}

  async handleClick(code: string) {
    const redirectData = { count: 0 }
    await this.setupSubject.setupRequestSubject()
    const streamResponse = await this.getStreamResponse(code, redirectData)
    this.responseHandlerFactory.handle(streamResponse)
  }

  public async getStreamResponse(
    code: string,
    redirectData: RedirectData,
  ): Promise<StreamResponse> {
    this.checkIncrementRedirectCount(redirectData)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)
    stream.campaign = campaign

    await this.setupSubject.setupStreamSubject(stream)

    const streamResponse = await this.handleStreamService.handleStream(stream)

    const clickData = this.clickContext.getClickData()
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

  private checkIncrementRedirectCount(redirectData: RedirectData) {
    redirectData.count++
    if (redirectData.count > 5) {
      throw new HttpException('To many redirects', HttpStatus.BAD_REQUEST)
    }
  }
}
