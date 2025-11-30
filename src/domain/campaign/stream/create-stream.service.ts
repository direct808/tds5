import { Injectable } from '@nestjs/common'
import { CommonStreamService } from './common-stream.service'
import { StreamRepository } from './stream.repository'
import { CreateStreamDto } from '../dto/create-stream.dto'
import { CreateStreamOfferService } from '../stream-offer/create-stream-offer.service'
import { Transaction } from '@/infra/prisma/prisma-transaction'
import { StreamSchemaEnum } from '@generated/prisma/enums'

@Injectable()
export class CreateStreamService {
  constructor(
    private readonly commonService: CommonStreamService,
    private readonly repository: StreamRepository,
    private readonly createStreamOfferService: CreateStreamOfferService,
  ) {}

  public async createStreams(
    trx: Transaction,
    campaignId: string,
    userId: string,
    streams: CreateStreamDto[],
  ): Promise<void> {
    for (const stream of streams) {
      await this.createStream(trx, campaignId, userId, stream)
    }
  }

  public async createStream(
    trx: Transaction,
    campaignId: string,
    userId: string,
    input: CreateStreamDto,
  ): Promise<void> {
    await this.commonService.ensureCampaignExists(
      userId,
      input.actionCampaignId,
    )
    const data = this.commonService.buildData(input, campaignId)
    const stream = await this.repository.create(trx, data)

    await this.createStreamOffers(trx, input, stream.id, userId)
  }

  private async createStreamOffers(
    trx: Transaction,
    input: CreateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<void> {
    if (
      !input.offers ||
      input.offers.length === 0 ||
      input.schema !== StreamSchemaEnum.LANDINGS_OFFERS
    ) {
      return
    }

    await this.createStreamOfferService.createStreamOffers(
      trx,
      streamId,
      userId,
      input.offers,
    )
  }
}
