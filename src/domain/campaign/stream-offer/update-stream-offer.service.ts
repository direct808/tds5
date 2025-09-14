import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { UpdateStreamOfferDto } from '../dto/update-stream-offer.dto'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { StreamOfferRepository } from '@/infra/repositories/stream-offer.repository'
import { getIdsForDelete } from '@/infra/repositories/utils/repository-utils'
import { StreamOffer } from '../entity/stream-offer.entity'

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
    await this.prepareInput(manager, streamId, userId, input)
    const dataForSave = this.buildSaveData(streamId, input)
    await this.saveStreamOffers(manager, dataForSave)
  }

  private async prepareInput(
    manager: EntityManager,
    streamId: string,
    userId: string,
    input: UpdateStreamOfferDto[],
  ): Promise<void> {
    await this.deleteOldStreamOffers(manager, input, streamId)
    this.commonService.checkPercentSum(input)
    this.commonService.checkForRepeatOffers(input)
    await this.commonService.ensureOffersExists(input, userId)
  }

  private buildSaveData(
    streamId: string,
    input: UpdateStreamOfferDto[],
  ): Partial<StreamOffer>[] {
    const dataForCreate = this.commonService.buildCreateData(
      streamId,
      input.filter((item) => !item.id),
    )

    const dataForUpdate = this.buildUpdateData(
      streamId,
      input.filter((item) => Boolean(item.id)),
    )

    return dataForCreate.concat(dataForUpdate)
  }

  private async saveStreamOffers(
    manager: EntityManager,
    dataForSave: Partial<StreamOffer>[],
  ) {
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
    const idsForDelete = await this.getIdsForDelete(manager, input, streamId)

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

  private async getIdsForDelete(
    manager: EntityManager,
    input: UpdateStreamOfferDto[],
    streamId: string,
  ): Promise<string[]> {
    const existsStreamOffers = await this.streamOfferRepository.getByStreamId(
      manager,
      streamId,
    )

    return getIdsForDelete(existsStreamOffers, input)
  }
}
