import { Injectable } from '@nestjs/common'
import {
  StreamOfferCreateManyInput,
  StreamOfferModel,
  StreamOfferUncheckedCreateInput,
} from '../../../generated/prisma/models/StreamOffer'
import {
  prismaTransaction,
  Transaction,
} from '@/infra/prisma/prisma-transaction'

@Injectable()
export class StreamOfferRepository {
  public async saveMany(
    trx: Transaction,
    data: StreamOfferUncheckedCreateInput[],
  ): Promise<void> {
    await prismaTransaction(trx).get().streamOffer.createMany({
      data,
    })
  }

  public getByStreamId(
    trx: Transaction,
    streamId: string,
  ): Promise<StreamOfferModel[]> {
    return prismaTransaction(trx)
      .get()
      .streamOffer.findMany({ where: { streamId } })
  }

  public async delete(trx: Transaction, ids: string[]): Promise<void> {
    await prismaTransaction(trx)
      .get()
      .streamOffer.deleteMany({ where: { id: { in: ids } } })
  }
}
