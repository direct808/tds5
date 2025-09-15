import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { CommonStreamService } from './common-stream.service'
import { StreamRepository } from './stream.repository'
import { CreateStreamDto } from '../dto/create-stream.dto'
import { CreateStreamOfferService } from '../stream-offer/create-stream-offer.service'
import { CampaignStreamSchema } from '@/domain/campaign/types'

@Injectable()
export class CreateStreamService {
  constructor(
    private readonly commonService: CommonStreamService,
    private readonly repository: StreamRepository,
    private readonly createStreamOfferService: CreateStreamOfferService,
  ) {}

  public async createStreams(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streams: CreateStreamDto[],
  ): Promise<void> {
    for (const stream of streams) {
      await this.createStream(manager, campaignId, userId, stream)
    }
  }

  public async createStream(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    input: CreateStreamDto,
  ): Promise<void> {
    await this.commonService.ensureCampaignExists(
      userId,
      input.actionCampaignId,
    )
    const data = this.commonService.buildData(input, campaignId)
    const stream = await this.repository.create(manager, data)

    await this.createStreamOffers(manager, input, stream.id, userId)
  }

  private async createStreamOffers(
    manager: EntityManager,
    input: CreateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<void> {
    if (
      !input.offers ||
      input.offers.length === 0 ||
      input.schema !== CampaignStreamSchema.LANDINGS_OFFERS
    ) {
      return
    }

    await this.createStreamOfferService.createStreamOffers(
      manager,
      streamId,
      userId,
      input.offers,
    )
  }
}
