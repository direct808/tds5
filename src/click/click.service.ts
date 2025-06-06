import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

    const clickIds = await this.clickIdService.getVisitorIds(request)
    const requestData = this.requestDataMapper.convert(request)
    const deviceInfo = this.userAgentService.getUserAgentInfo(
      requestData.userAgent,
    )

    Object.assign(clickData, clickIds)
    Object.assign(clickData, requestData)
    Object.assign(clickData, deviceInfo)

    const streamResponse = await this.getStreamResponse(cContext)
    this.responseHandlerFactory.handle(cContext, streamResponse)
  }

  public async getStreamResponse(
    cContext: ClickContext,
  ): Promise<StreamResponse> {
    const { code, clickData } = cContext
    this.processRedirectCount(cContext)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)

    clickData.campaignId = campaign.id
    clickData.streamId = stream.id

    await this.registerClickService.register(clickData)

    return this.handleStreamService.handleStream(stream, cContext)
  }

  private async getFullCampaignByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new Error('No campaign')
    }

    return campaign
  }

  private processRedirectCount(cContext: ClickContext) {
    cContext.redirectCount++
    if (cContext.redirectCount > 5) {
      throw new HttpException('To many redirects', HttpStatus.BAD_REQUEST)
    }
  }
}
