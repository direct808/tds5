import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CommonStreamService } from './common-stream.service'
import { StreamRepository } from './stream.repository'
import { CreateStreamService } from './create-stream.service'
import { getIdsForDelete } from '@/infra/repositories/utils/repository-utils'
import { arrayUnique } from '@/shared/helpers'
import { UpdateStreamOfferService } from '../stream-offer/update-stream-offer.service'
import { UpdateStreamDto } from '../dto/update-stream.dto'
import { Transaction } from '@/infra/prisma/prisma-transaction'
import { StreamSchemaEnum } from '../../../../generated/prisma/enums'

@Injectable()
export class UpdateStreamService {
  constructor(
    private readonly commonService: CommonStreamService,
    private readonly repository: StreamRepository,
    private readonly updateStreamOfferService: UpdateStreamOfferService,
    private readonly createStreamService: CreateStreamService,
  ) {}

  public async updateStreams(
    trx: Transaction,
    campaignId: string,
    userId: string,
    streams: UpdateStreamDto[],
  ): Promise<void> {
    await this.ensureStreamExists(trx, streams, campaignId)
    await this.deleteOldStreams(trx, streams, campaignId)

    for (const stream of streams) {
      await this.processStream(trx, campaignId, userId, stream)
    }
  }

  private async processStream(
    trx: Transaction,
    campaignId: string,
    userId: string,
    stream: UpdateStreamDto,
  ): Promise<void> {
    this.checkCampaignSelfReferencing(campaignId, stream.actionCampaignId)

    if (stream.id) {
      await this.updateStream(trx, campaignId, userId, stream, stream.id)
    } else {
      await this.createStreamService.createStream(
        trx,
        campaignId,
        userId,
        stream,
      )
    }
  }

  private async updateStream(
    trx: Transaction,
    campaignId: string,
    userId: string,
    input: UpdateStreamDto,
    streamId: string,
  ): Promise<void> {
    await this.commonService.ensureCampaignExists(
      userId,
      input.actionCampaignId,
    )
    const data = this.commonService.buildData(input, campaignId)
    await this.repository.update(trx, streamId, data)

    await this.updateStreamOffers(trx, input, streamId, userId)
  }

  private checkCampaignSelfReferencing(
    campaignId: string,
    actionCampaignId?: string,
  ): void {
    if (campaignId === actionCampaignId) {
      throw new BadRequestException('Company should not refer to itself')
    }
  }

  private async updateStreamOffers(
    trx: Transaction,
    input: UpdateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<void> {
    if (
      !input.offers ||
      input.schema !== StreamSchemaEnum.LANDINGS_OFFERS ||
      input.offers.length === 0
    ) {
      return
    }

    await this.updateStreamOfferService.updateStreamOffers(
      trx,
      streamId,
      userId,
      input.offers,
    )
  }

  private async deleteOldStreams(
    trx: Transaction,
    input: UpdateStreamDto[],
    campaignId: string,
  ): Promise<void> {
    const idsForDelete = await this.getIdsForDelete(trx, input, campaignId)

    if (idsForDelete.length === 0) {
      return
    }

    await this.repository.delete(trx, idsForDelete)
  }

  private async ensureStreamExists(
    trx: Transaction,
    input: { id?: string }[],
    campaignId: string,
  ): Promise<void> {
    const offerIds = arrayUnique(
      input.filter((item) => Boolean(item.id)).map((item) => item.id),
    ) as string[]

    const offers = await this.repository.getByIdsAndCampaignId(
      trx,
      offerIds,
      campaignId,
    )

    if (offers.length !== offerIds.length) {
      throw new NotFoundException('Some stream ids not found')
    }
  }

  private async getIdsForDelete(
    trx: Transaction,
    input: UpdateStreamDto[],
    campaignId: string,
  ): Promise<string[]> {
    const existsStreams = await this.repository.getByCampaignId(trx, campaignId)

    return getIdsForDelete(existsStreams, input)
  }
}
