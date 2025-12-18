import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from './utils/repository-utils'
import { FullCampaign } from '@/domain/campaign/types'
import {
  CampaignModel,
  CampaignUncheckedCreateInput,
} from '@generated/prisma/models/Campaign'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
  prismaTransaction,
  PrismaTransaction,
  Transaction,
} from '@/infra/prisma/prisma-transaction'

@Injectable()
export class CampaignRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  constructor(private readonly prisma: PrismaService) {}

  public getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<CampaignModel | null> {
    return this.prisma.campaign.findFirst({ where: { name, userId } })
  }

  public create(
    tr: Transaction,
    data: CampaignUncheckedCreateInput,
  ): Promise<CampaignModel> {
    if (!(tr instanceof PrismaTransaction)) {
      throw new Error('Not prisma trx')
    }

    return tr.get().campaign.create({ data })
  }

  public async update(
    trx: Transaction,
    id: string,
    data: Partial<CampaignModel>,
  ): Promise<void> {
    await prismaTransaction(trx).get().campaign.update({ where: { id }, data })
  }

  public getByIdAndUserId(
    args: Pick<CampaignModel, 'id' | 'userId'>,
  ): Promise<CampaignModel | null> {
    return this.prisma.campaign.findFirst({
      where: { id: args.id, userId: args.userId },
    })
  }

  public getFullByCode(code: string): Promise<FullCampaign | null> {
    return this.prisma.campaign.findFirst({
      where: { code, active: true },
      include: {
        streams: {
          include: {
            streamOffers: {
              include: {
                offer: {
                  include: {
                    affiliateNetwork: true,
                  },
                },
              },
            },
            actionCampaign: true,
          },
        },
      },
    })
  }
}
