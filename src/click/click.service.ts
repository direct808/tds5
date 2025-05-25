import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RequestDataMapper } from './request-data-mapper'
import { CampaignRepository } from '../campaign/campaign.repository'
import { SelectStreamService } from './select-stream.service'
import { Campaign } from '../campaign/entity/campaign.entity'
import { HandleStreamService } from './handle-stream.service'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { ClickContext, StreamResponse } from './types'

@Injectable()
export class ClickService {
  constructor(
    private readonly requestDataMapper: RequestDataMapper,
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
  ) {}

  async handleClick(cRequest: ClickContext) {
    const streamResponse = await this.getStreamResponse(cRequest)
    this.responseHandlerFactory.handle(
      cRequest.query,
      cRequest.response,
      streamResponse,
    )
  }

  public async getStreamResponse(
    cContext: ClickContext,
  ): Promise<StreamResponse> {
    const { code, request } = cContext
    this.processRedirectCount(cContext)
    const requestData = this.requestDataMapper.convert(code, request)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)
    // console.log(stream)
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
