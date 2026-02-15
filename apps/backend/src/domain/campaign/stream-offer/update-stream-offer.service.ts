import { Injectable } from '@nestjs/common'
import { UpdateStreamOfferDto } from '../dto/update-stream-offer.dto'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { StreamOfferRepository } from '@/infra/repositories/stream-offer.repository'
import { getIdsForDelete } from '@/infra/repositories/utils/repository-utils'
import { Transaction } from '@/infra/prisma/prisma-transaction'
import { StreamOfferUncheckedCreateInput } from '@generated/prisma/models/StreamOffer'
import { isNullable } from '@/shared/helpers'

type BuildUpdateDataResult = {
  id: string | undefined
  streamId: string
  offerId: string
  active: boolean
  percent: number
}

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
    trx: Transaction,
    streamId: string,
    userId: string,
    input: UpdateStreamOfferDto[],
  ): Promise<void> {
    await this.prepareInput(trx, streamId, userId, input)
    const dataForSave = this.buildSaveData(streamId, input)
    await this.saveStreamOffers(trx, dataForSave)
  }

  private async prepareInput(
    trx: Transaction,
    streamId: string,
    userId: string,
    input: UpdateStreamOfferDto[],
  ): Promise<void> {
    await this.deleteOldStreamOffers(trx, input, streamId)
    this.commonService.checkPercentSum(input)
    this.commonService.checkForRepeatOffers(input)
    await this.commonService.ensureOffersExists(input, userId)
  }

  private buildSaveData(
    streamId: string,
    input: UpdateStreamOfferDto[],
  ): StreamOfferUncheckedCreateInput[] {
    const dataForCreate = this.commonService.buildCreateData(
      streamId,
      input.filter((item) => isNullable(item.id)),
    )

    const dataForUpdate = this.buildUpdateData(
      streamId,
      input.filter((item) => Boolean(item.id)),
    )

    return dataForCreate.concat(dataForUpdate)
  }

  private async saveStreamOffers(
    trx: Transaction,
    dataForSave: StreamOfferUncheckedCreateInput[],
  ): Promise<void> {
    if (dataForSave.length > 0) {
      await this.streamOfferRepository.saveMany(trx, dataForSave)
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
    trx: Transaction,
    input: UpdateStreamOfferDto[],
    streamId: string,
  ): Promise<void> {
    const idsForDelete = await this.getIdsForDelete(trx, input, streamId)

    if (idsForDelete.length === 0) {
      return
    }

    await this.streamOfferRepository.delete(trx, idsForDelete)
  }

  /**
   * Build data for update offer
   * @param streamId
   * @param input
   * @private
   */
  private buildUpdateData(
    streamId: string,
    input: UpdateStreamOfferDto[],
  ): BuildUpdateDataResult[] {
    return input.map((d) => ({
      id: d.id,
      streamId,
      offerId: d.offerId,
      active: d.active,
      percent: d.percent,
    }))
  }

  private async getIdsForDelete(
    trx: Transaction,
    input: UpdateStreamOfferDto[],
    streamId: string,
  ): Promise<string[]> {
    const existsStreamOffers = await this.streamOfferRepository.getByStreamId(
      trx,
      streamId,
    )

    return getIdsForDelete(existsStreamOffers, input)
  }
}
