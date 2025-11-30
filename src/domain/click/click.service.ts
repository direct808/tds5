import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SelectStreamService } from './stream/select-stream.service'
import { SchemaService } from '@/domain/click/stream/schema/schema.service'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { StreamResponse } from './types'
import { RegisterClickService } from './register-click.service'
import { SetupSubject } from './observers/setup-subject'
import { ClickContext } from './shared/click-context.service'
import { CampaignCacheService } from '@/domain/campaign-cache/campaign-cache.service'
import { CampaignModel } from '@generated/prisma/models/Campaign'
import { StreamFull, StreamFullWithCampaign } from '@/domain/campaign/types'

type RedirectData = { count: number }

@Injectable()
export class ClickService {
  constructor(
    private readonly selectStreamService: SelectStreamService,
    private readonly schemaService: SchemaService,
    private readonly responseHandlerFactory: ResponseHandlerFactory,
    private readonly registerClickService: RegisterClickService,
    private readonly setupSubject: SetupSubject,
    private readonly clickContext: ClickContext,
    private readonly campaignCacheService: CampaignCacheService,
  ) {}

  async handleClick(code: string): Promise<void> {
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
    const campaign = await this.campaignCacheService.getFullByCode(code)

    clickData.campaignId = campaign.id
    clickData.sourceId = campaign.sourceId

    const stream = await this.selectStreamService.selectStream(campaign.streams)
    clickData.streamId = stream.id

    await this.setupSubject.setupStreamSubject(stream)

    const streamWithCampaign = this.makeStreamWithCampaign(stream, campaign)

    const streamResponse = await this.schemaService.handle(streamWithCampaign)

    if ('url' in streamResponse) {
      clickData.destination = streamResponse.url
    }

    this.registerClickService.register(structuredClone(clickData))

    if ('campaignCode' in streamResponse) {
      clickData.previousCampaignId = campaign.id

      return this.getStreamResponse(streamResponse.campaignCode, redirectData)
    }

    return streamResponse
  }

  private makeStreamWithCampaign(
    stream: StreamFull,
    campaign: CampaignModel,
  ): StreamFullWithCampaign {
    return {
      ...stream,
      campaign,
    }
  }

  private checkIncrementRedirectCount(redirectData: RedirectData): void {
    redirectData.count++
    if (redirectData.count > 5) {
      throw new HttpException('To many redirects', HttpStatus.BAD_REQUEST)
    }
  }
}
