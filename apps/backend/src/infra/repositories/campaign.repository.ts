import { Injectable } from '@nestjs/common'
import {
  IDeleteMany,
  IGetEntitiesByIdsAndUserId,
  IGetEntityByNameAndUserId,
  ISoftDeleteMany,
  NameAndUserId,
} from './utils/repository-utils'
import { FullCampaign } from '../../domain/campaign/types'
import {
  CampaignModel,
  CampaignUncheckedCreateInput,
  CampaignWhereInput,
} from '@generated/prisma/models/Campaign'
import { PrismaService } from '../prisma/prisma.service'
import {
  prismaTransaction,
  PrismaTransaction,
  Transaction,
} from '../prisma/prisma-transaction'

export type GetFullByArgs = { code: string } | { domain: string }

@Injectable()
export class CampaignRepository
  implements
    IGetEntityByNameAndUserId<CampaignModel>,
    IGetEntitiesByIdsAndUserId<CampaignModel>,
    IDeleteMany,
    ISoftDeleteMany
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

  public getByIdsAndUserId: IGetEntitiesByIdsAndUserId<CampaignModel>['getByIdsAndUserId'] =
    (args) => {
      return this.prisma.campaign.findMany({
        where: { id: { in: args.ids }, userId: args.userId },
      })
    }

  public getFullBy(args: GetFullByArgs): Promise<FullCampaign | null> {
    const where: CampaignWhereInput = { active: true }

    if ('code' in args) {
      where.code = args.code
    }

    if ('domain' in args) {
      where.indexPageDomains = {
        some: { name: args.domain },
      }
    }

    return this.prisma.campaign.findFirst({
      where,
      include: {
        domain: true,
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

  public async getIndexPageDomainNames(codes: string[]): Promise<string[]> {
    const result = await this.prisma.domain.findMany({
      select: { name: true },
      where: { indexPageCampaign: { code: { in: codes } } },
    })

    return result.map(({ name }) => name)
  }

  public list(userId: string): Promise<CampaignModel[]> {
    return this.prisma.campaign.findMany({
      where: {
        userId,
      },
    })
  }

  public deleteMany: IDeleteMany['deleteMany'] = async (ids) => {
    await this.prisma.campaign.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public softDeleteMany: ISoftDeleteMany['softDeleteMany'] = async (ids) => {
    await this.prisma.campaign.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
  }

  public async resetDomainIds(ids: string[], trx?: Transaction): Promise<void> {
    const prisma = trx ? prismaTransaction(trx).get() : this.prisma
    await prisma.campaign.updateMany({
      where: { domainId: { in: ids } },
      data: { domainId: null },
    })
  }
}
