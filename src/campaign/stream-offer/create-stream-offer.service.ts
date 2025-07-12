import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { CreateStreamOfferDto } from '../dto/create-stream-offer.dto.js'
import { StreamOfferRepository } from './stream-offer.repository.js'
import { CommonStreamOfferService } from './common-stream-offer.service.js'

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
    manager: EntityManager,
    streamId: string,
    userId: string,
    input: CreateStreamOfferDto[],
  ): Promise<void> {
    this.commonService.checkPercentSum(input)

    this.commonService.checkForRepeatOffers(input)

    await this.commonService.ensureOffersExists(input, userId)

    const data = this.commonService.buildCreateData(streamId, input)

    await this.streamOfferRepository.saveMany(manager, data)
  }
}
