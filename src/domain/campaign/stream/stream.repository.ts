import { Injectable } from '@nestjs/common'
import {
  StreamCreateInput,
  StreamModel,
  StreamUncheckedCreateInput,
} from '@generated/prisma/models/Stream'
import {
  prismaTransaction,
  Transaction,
} from '@/infra/prisma/prisma-transaction'

@Injectable()
export class StreamRepository {
  public create(
    trx: Transaction,
    data: StreamUncheckedCreateInput,
  ): Promise<StreamModel> {
    return prismaTransaction(trx).get().stream.create({ data })
  }

  public async update(
    trx: Transaction,
    id: string,
    data: Partial<StreamCreateInput>,
  ): Promise<void> {
    // await manager.update(Stream, id, args)
    await prismaTransaction(trx).get().stream.update({ where: { id }, data })
  }

  public getByCampaignId(
    trx: Transaction,
    campaignId: string,
  ): Promise<StreamModel[]> {
    return prismaTransaction(trx)
      .get()
      .stream.findMany({ where: { campaignId } })
  }

  public async delete(trx: Transaction, ids: string[]): Promise<void> {
    await prismaTransaction(trx)
      .get()
      .stream.deleteMany({ where: { id: { in: ids } } })
  }

  getByIdsAndCampaignId(
    trx: Transaction,
    ids: string[],
    campaignId: string,
  ): Promise<StreamModel[]> {
    return prismaTransaction(trx)
      .get()
      .stream.findMany({ where: { id: { in: ids }, campaignId } })
  }
}
