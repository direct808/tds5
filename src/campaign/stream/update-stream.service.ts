import { UpdateStreamDto } from '../dto'
import { EntityManager } from 'typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CommonStreamService } from './common-stream.service'
import { StreamRepository } from './stream.repository'
import { UpdateStreamOfferService } from '../stream-offer'
import { CampaignStreamSchema } from '../entity'
import { CreateStreamService } from './create-stream.service'
import { arrayUnique } from '../../utils'

@Injectable()
export class UpdateStreamService {
  constructor(
    private readonly commonService: CommonStreamService,
    private readonly repository: StreamRepository,
    private readonly updateStreamOfferService: UpdateStreamOfferService,
    private readonly createStreamService: CreateStreamService,
  ) {}

  public async updateStreams(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streams: UpdateStreamDto[],
  ) {
    await this.ensureStreamExists(manager, streams, campaignId)
    await this.deleteOldStreams(manager, streams, campaignId)

    for (const stream of streams) {
      if (stream.id) {
        await this.updateStream(manager, campaignId, userId, stream, stream.id)
      } else {
        await this.createStreamService.createStream(
          manager,
          campaignId,
          userId,
          stream,
        )
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

    await this.commonService.ensureCampaignExists(
      userId,
      input.actionCampaignId,
    )
    const data = this.commonService.buildData(input, campaignId)
    await this.repository.update(manager, streamId, data)

    await this.updateStreamOffers(manager, input, streamId, userId)
  }

  private checkCampaignSelfReferencing(
    campaignId: string,
    actionCampaignId?: string,
  ) {
    if (campaignId === actionCampaignId) {
      throw new BadRequestException('Company should not refer to itself')
    }
  }

  private async updateStreamOffers(
    manager: EntityManager,
    input: UpdateStreamDto,
    streamId: string,
    userId: string,
  ) {
    if (!input.offers) {
      return
    }

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

  private async deleteOldStreams(
    manager: EntityManager,
    input: UpdateStreamDto[],
    campaignId: string,
  ): Promise<void> {
    const existsStreams = await this.repository.getByCampaignId(
      manager,
      campaignId,
    )

    const existsStreamsIds = existsStreams.map((offer) => offer.id)
    const inputStreamsIds = input
      .filter((stream) => Boolean(stream.id))
      .map((stream) => stream.id)

    const idsForDelete = existsStreamsIds.filter(
      (item) => !inputStreamsIds.includes(item),
    )

    if (idsForDelete.length === 0) {
      return
    }

    await this.repository.delete(manager, idsForDelete)
  }

  public async ensureStreamExists(
    manager: EntityManager,
    input: { id?: string }[],
    campaignId: string,
  ) {
    const offerIds = arrayUnique(
      input.filter((item) => Boolean(item.id)).map((item) => item.id),
    ) as string[]

    const offers = await this.repository.getByIdsAndCampaignId(
      manager,
      offerIds,
      campaignId,
    )

    if (offers.length !== offerIds.length) {
      throw new BadRequestException('Some stream ids not found')
    }
  }
}
