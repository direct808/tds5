import { Injectable } from '@nestjs/common'
import { StreamInputDto } from './dto/stream-input.dto'
import { EntityManager } from 'typeorm'
import { StreamRepository } from './stream.repository'
import { CampaignRepository } from './campaign.repository'
import { ensureEntityExists } from '../utils'
import { CampaignStreamSchema, Stream } from './entity'
import { StreamOfferService } from './stream-offer.service'

@Injectable()
export class StreamService {
  constructor(
    private readonly repository: StreamRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly streamOfferService: StreamOfferService,
  ) {}

  public async create(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streamsInput: StreamInputDto[],
  ) {
    for (const stream of streamsInput) {
      await this.createOne(manager, campaignId, userId, stream)
    }
  }

  private async createOne(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    input: StreamInputDto,
  ) {
    await this.ensureCampaignExists(userId, input.actionCampaignId)
    const data = this.buildData(input, campaignId)
    const stream = await this.repository.create(manager, data)

    await this.createStreamOffers(manager, input, stream.id, userId)
  }

  private async ensureCampaignExists(userId: string, campaignId?: string) {
    if (!campaignId) {
      return
    }
    await ensureEntityExists(
      this.campaignRepository,
      {
        userId,
        id: campaignId,
      },
      'actionCampaignId not found',
    )
  }

  private buildData(
    input: StreamInputDto,
    campaignId: string,
  ): Partial<Stream> {
    return {
      name: input.name,
      campaignId,
      schema: input.schema,
      redirectType: input.redirectType,
      redirectUrl: input.redirectUrl,
      actionType: input.actionType,
      actionCampaignId: input.actionCampaignId,
      actionContent: input.actionContent,
    }
  }

  private async createStreamOffers(
    manager: EntityManager,
    input: StreamInputDto,
    streamId: string,
    userId: string,
  ) {
    if (
      input.schema !== CampaignStreamSchema.LANDINGS_OFFERS ||
      input.offers.length === 0
    ) {
      return
    }

    await this.streamOfferService.create(
      manager,
      streamId,
      userId,
      input.offers,
    )
  }
}
