import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateStreamDto } from './dto'
import { EntityManager } from 'typeorm'
import { StreamRepository } from './stream.repository'
import { CampaignRepository } from './campaign.repository'
import { ensureEntityExists } from '../utils'
import { CampaignStreamSchema, Stream } from './entity'
import { UpdateStreamDto } from './dto/update-stream.dto'
import {
  CreateStreamOfferService,
  UpdateStreamOfferService,
} from './stream-offer'

@Injectable()
export class StreamService {
  constructor(
    private readonly repository: StreamRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly createStreamOfferService: CreateStreamOfferService,
    private readonly updateStreamOfferService: UpdateStreamOfferService,
  ) {}

  public async createStreams(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streams: CreateStreamDto[],
  ) {
    for (const stream of streams) {
      await this.createStream(manager, campaignId, userId, stream)
    }
  }

  public async updateStreams(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streams: UpdateStreamDto[],
  ) {
    for (const stream of streams) {
      if (stream.id) {
        await this.updateStream(manager, campaignId, userId, stream, stream.id)
      } else {
        await this.createStream(manager, campaignId, userId, stream)
      }
    }
  }

  private async updateStream(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    input: UpdateStreamDto,
    streamId: string,
  ) {
    this.checkCampaignSelfReferencing(campaignId, input.actionCampaignId)
    await this.ensureCampaignExists(userId, input.actionCampaignId)
    const data = this.buildData(input, campaignId)
    await this.repository.update(manager, streamId, data)

    await this.updateStreamOffers(manager, input, streamId, userId)
  }

  private async createStream(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    input: CreateStreamDto,
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
    input: CreateStreamDto,
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
    input: CreateStreamDto,
    streamId: string,
    userId: string,
  ) {
    if (
      input.schema !== CampaignStreamSchema.LANDINGS_OFFERS ||
      input.offers.length === 0
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

  private async updateStreamOffers(
    manager: EntityManager,
    input: UpdateStreamDto,
    streamId: string,
    userId: string,
  ) {
    if (
      input.schema !== CampaignStreamSchema.LANDINGS_OFFERS ||
      input.offers.length === 0
    ) {
      return
    }

    await this.updateStreamOfferService.updateStreamOffers(
      manager,
      streamId,
      userId,
      input.offers,
    )
  }

  private checkCampaignSelfReferencing(
    campaignId: string,
    actionCampaignId?: string,
  ) {
    if (campaignId === actionCampaignId) {
      throw new BadRequestException('Company should not refer to itself')
    }
  }
}
