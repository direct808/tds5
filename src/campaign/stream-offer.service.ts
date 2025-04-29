import { BadRequestException, Injectable } from '@nestjs/common'
import { StreamOfferRepository } from './stream-offer.repository'
import { EntityManager } from 'typeorm'
import { StreamOfferInputDto } from './dto/stream-offer-input.dto'
import { OfferRepository } from '../offer/offer.repository'
import { arrayUnique } from '../utils'

@Injectable()
export class StreamOfferService {
  constructor(
    private readonly streamOfferRepository: StreamOfferRepository,
    private readonly offerRepository: OfferRepository,
  ) {}

  /**
   * Create many stream_offer records
   * @param manager
   * @param streamId
   * @param userId
   * @param input
   */
  public async create(
    manager: EntityManager,
    streamId: string,
    userId: string,
    input: StreamOfferInputDto[],
  ): Promise<void> {
    this.checkPercentSum(input)

    this.checkForRepeatOffers(input)

    await this.ensureOfferExists(input, userId)

    const data = this.buildData(streamId, input)

    await this.streamOfferRepository.create(manager, data)
  }

  /**
   * Check sum of percent
   * @param input
   * @private
   */
  private checkPercentSum(input: StreamOfferInputDto[]) {
    const sum = input.reduce(
      (accumulator, currentValue) => accumulator + currentValue.percent,
      0,
    )

    if (sum !== 100) {
      throw new BadRequestException('Sum of the percentages should be 100')
    }
  }

  /**
   * Build data for create offer
   * @param streamId
   * @param input
   * @private
   */
  private buildData(streamId: string, input: StreamOfferInputDto[]) {
    return input.map((d) => ({
      streamId,
      offerId: d.offerId,
      active: d.active,
      percent: d.percent,
    }))
  }

  /**
   * Check for repeat offers
   * @param input
   * @private
   */
  private checkForRepeatOffers(input: { offerId: string }[]) {
    const offerIds = arrayUnique(input.map((item) => item.offerId))
    if (offerIds.length !== input.length) {
      throw new BadRequestException('Offers should not be repeated')
    }
  }

  /**
   * Check if offer exists
   * @param input
   * @param userId
   * @private
   */

  private async ensureOfferExists(
    input: { offerId: string }[],
    userId: string,
  ) {
    const offerIds = arrayUnique(input.map((item) => item.offerId))
    const offers = await this.offerRepository.getByIdsAndUserId(
      offerIds,
      userId,
    )

    if (offers.length !== offerIds.length) {
      throw new BadRequestException('Some offers not found')
    }
  }
}
