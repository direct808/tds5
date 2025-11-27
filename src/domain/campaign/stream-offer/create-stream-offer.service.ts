import { Injectable } from '@nestjs/common'
import { CreateStreamOfferDto } from '../dto/create-stream-offer.dto'
import { StreamOfferRepository } from '@/infra/repositories/stream-offer.repository'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { Transaction } from '@/infra/prisma/prisma-transaction'

@Injectable()
export class CreateStreamOfferService {
  constructor(
    private readonly streamOfferRepository: StreamOfferRepository,
    private readonly commonService: CommonStreamOfferService,
  ) {}

  /**
   * Create many stream_offer records
   * @param manager
   * @param streamId
   * @param userId
   * @param input
   */
  public async createStreamOffers(
    trx: Transaction,
    streamId: string,
    userId: string,
    input: CreateStreamOfferDto[],
  ): Promise<void> {
    this.commonService.checkPercentSum(input)

    this.commonService.checkForRepeatOffers(input)

    await this.commonService.ensureOffersExists(input, userId)

    const data = this.commonService.buildCreateData(streamId, input)

    await this.streamOfferRepository.saveMany(trx, data)
  }
}
