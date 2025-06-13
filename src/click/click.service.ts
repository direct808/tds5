import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RequestDataMapper } from './request-data-mapper'
import { CampaignRepository } from '../campaign/campaign.repository'
import { SelectStreamService } from './select-stream.service'
import { Campaign } from '../campaign/entity/campaign.entity'
import { HandleStreamService } from './handle-stream.service'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { ClickContext, StreamResponse } from './types'
import { ClickIdService } from './click-id.service'
import { UserAgentService } from './user-agent.service'
import { RegisterClickService } from './register-click.service'
import {
  CampaignStreamSchema,
  Stream,
  StreamActionType,
} from '../campaign/entity/stream.entity'

@Injectable()
export class ClickService {
  constructor(
    private readonly requestDataMapper: RequestDataMapper,
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
    private readonly clickIdService: ClickIdService,
    private readonly userAgentService: UserAgentService,
    private readonly registerClickService: RegisterClickService,
  ) {}

  async handleClick(cContext: ClickContext) {
    const { request, clickData } = cContext

    const requestData = this.requestDataMapper.convert(request)
    const deviceInfo = this.userAgentService.getUserAgentInfo(
      requestData.userAgent,
    )

    clickData.visitorId = await this.clickIdService.getVisitorIds(request)
    Object.assign(clickData, requestData)
    Object.assign(clickData, deviceInfo)

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
    clickData.campaignId = campaign.id
    clickData.streamId = stream.id
    clickData.id = await this.clickIdService.getClickId(clickData.visitorId)

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

  private isToCampaignType(stream: Stream): boolean {
    return (
      stream.schema === CampaignStreamSchema.ACTION &&
      stream.actionType === StreamActionType.TO_CAMPAIGN
    )
  }
}
