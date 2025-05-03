import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateStreamOfferDto } from '../dto'
import { OfferRepository } from '../../offer/offer.repository'
import { arrayUnique } from '../../utils'

@Injectable()
export class CommonStreamOfferService {
  constructor(private readonly offerRepository: OfferRepository) {}

  /**
   * Check sum of percent
   * @param input
   * @private
   */
  public checkPercentSum(input: CreateStreamOfferDto[]) {
    const sum = input
      .filter((item) => item.active)
      .reduce(
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
  public buildCreateData(streamId: string, input: CreateStreamOfferDto[]) {
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
  public checkForRepeatOffers(input: { offerId: string }[]) {
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
  public async ensureOffersExists(
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
