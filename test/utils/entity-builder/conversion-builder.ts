import {
  ConversionModel,
  ConversionUncheckedCreateInput,
} from '../../../generated/prisma/models/Conversion'
import { PrismaClient } from '../../../generated/prisma/client'

export class ConversionBuilder {
  private readonly fields = {} as ConversionUncheckedCreateInput

  private constructor(fields = {} as ConversionUncheckedCreateInput) {
    this.fields = fields
  }

  static create(
    fields = {} as ConversionUncheckedCreateInput,
  ): ConversionBuilder {
    return new this(fields)
  }

  clickId(clickId: string): this {
    this.fields.clickId = clickId

    return this
  }

  status(status: string): this {
    this.fields.status = status

    return this
  }

  revenue(revenue: number): this {
    this.fields.revenue = revenue

    return this
  }

  async save(prisma: PrismaClient): Promise<ConversionModel> {
    return prisma.conversion.create({ data: this.fields })
  }
}
