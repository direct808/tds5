import { Injectable } from '@nestjs/common'
import { RequestDataMapper } from './request-data-mapper'
import { Request, Response } from 'express'
import { CampaignRepository } from '../campaign/campaign.repository'
import { SelectStreamService } from './select-stream.service'
import { Campaign } from '../campaign/entity/campaign.entity'
import { HandleStreamService } from './handle-stream.service'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'

@Injectable()
export class ClickService {
  constructor(
    private readonly requestDataMapper: RequestDataMapper,
    private readonly campaignRepository: CampaignRepository,
    private readonly selectStreamService: SelectStreamService,
    private readonly handleStreamService: HandleStreamService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
  ) {}

  async handleClick(
    code: string,
    request: Request,
    response: Response,
    query: Record<string, string>,
  ) {
    const requestData = this.requestDataMapper.convert(code, request)
    const campaign = await this.getFullCampaignByCode(code)
    const stream = await this.selectStreamService.selectStream(campaign.streams)
    console.log(stream)
    const streamResponse = await this.handleStreamService.handleStream(stream)
    this.responseHandlerFactory.handle(query, response, streamResponse)
  }

  private async getFullCampaignByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new Error('No campaign')
    }

    return campaign
  }
}
