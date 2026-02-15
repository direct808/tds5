import { PrismaClient } from '@generated/prisma/client'
import {
  DomainModel,
  DomainUncheckedCreateInput,
} from '@generated/prisma/models/Domain'

export class DomainBuilder {
  private fields = {} as DomainUncheckedCreateInput

  private constructor() {}

  public static create(): DomainBuilder {
    return new this()
  }

  name(name: string): this {
    this.fields.name = name

    return this
  }

  userId(userId: string): this {
    this.fields.userId = userId

    return this
  }

  indexPageCampaignId(indexPageCampaignId: string): this {
    this.fields.indexPageCampaignId = indexPageCampaignId

    return this
  }

  intercept404(intercept404: boolean): this {
    this.fields.intercept404 = intercept404

    return this
  }

  deletedAt(deletedAt: Date): this {
    this.fields.deletedAt = deletedAt

    return this
  }

  save({ domain }: PrismaClient): Promise<DomainModel> {
    return domain.create({ data: this.fields })
  }
}
