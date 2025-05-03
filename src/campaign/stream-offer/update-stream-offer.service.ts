import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { UpdateStreamOfferDto } from '../dto'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { StreamOfferRepository } from './stream-offer.repository'

@Injectable()
export class UpdateStreamOfferService {
  constructor(
    private readonly streamOfferRepository: StreamOfferRepository,
    private readonly commonService: CommonStreamOfferService,
  ) {}

  /**
   * Update many stream_offer records
   * @param manager
   * @param streamId
   * @param userId
   * @param input
   */
  public async updateStreamOffers(
    manager: EntityManager,
    streamId: string,
    userId: string,
    input: UpdateStreamOfferDto[],
  ): Promise<void> {
    await this.deleteOldStreamOffers(manager, input, streamId)

    this.commonService.checkPercentSum(input)

    this.commonService.checkForRepeatOffers(input)

    await this.commonService.ensureOffersExists(input, userId)

    const dataForCreate = this.commonService.buildCreateData(
      streamId,
      input.filter((item) => !item.id),
    )

    const dataForUpdate = this.buildUpdateData(
      streamId,
      input.filter((item) => Boolean(item.id)),
    )

    const dataForSave = dataForCreate.concat(dataForUpdate)

    if (dataForSave.length > 0) {
      await this.streamOfferRepository.saveMany(manager, dataForSave)
    }
  }

  /**
   * Removing records that are not present in the input
   * @param manager
   * @param input
   * @param streamId
   * @private
   */
  private async deleteOldStreamOffers(
    manager: EntityManager,
    input: UpdateStreamOfferDto[],
    streamId: string,
  ): Promise<void> {
    const existsStreamOffers = await this.streamOfferRepository.getByStreamId(
      manager,
      streamId,
    )

    const existsStreamOffersIds = existsStreamOffers.map((offer) => offer.id)
    const inputStreamOffersIds = input
      .filter((offer) => Boolean(offer.id))
      .map((offer) => offer.id)

    const idsForDelete = existsStreamOffersIds.filter(
      (item) => !inputStreamOffersIds.includes(item),
    )

    if (idsForDelete.length === 0) {
      return
    }

    await this.streamOfferRepository.delete(manager, idsForDelete)
  }

  /**
   * Build data for update offer
   * @param streamId
   * @param input
   * @private
   */
  private buildUpdateData(streamId: string, input: UpdateStreamOfferDto[]) {
    return input.map((d) => ({
      id: d.id,
      streamId,
      offerId: d.offerId,
      active: d.active,
      percent: d.percent,
    }))
  }
}
