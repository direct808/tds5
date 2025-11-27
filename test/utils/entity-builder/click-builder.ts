import {
  ClickModel,
  ClickUncheckedCreateInput,
} from '../../../generated/prisma/models/Click'
import { PrismaClient } from '../../../generated/prisma/client'

export class ClickBuilder {
  private readonly fields = {} as ClickUncheckedCreateInput

  private constructor(fields = {} as ClickUncheckedCreateInput) {
    this.fields = fields
  }

  static create(fields = {} as ClickUncheckedCreateInput): ClickBuilder {
    return new this(fields)
  }

  id(id: string): this {
    this.fields.id = id

    return this
  }

  campaignId(campaignId: string): this {
    this.fields.campaignId = campaignId

    return this
  }

  visitorId(visitorId: string): this {
    this.fields.visitorId = visitorId

    return this
  }

  createdAt(createdAt: Date): this {
    this.fields.createdAt = createdAt

    return this
  }

  async save(prisma: PrismaClient): Promise<ClickModel> {
    return prisma.click.create({ data: this.fields })
  }
}
