import { DataSource } from 'typeorm'
import { Conversion } from '@/domain/conversion/conversion.entity'

export class ConversionBuilder {
  private readonly fields: Partial<Conversion> = {}

  private constructor(fields: Partial<Conversion> = {}) {
    this.fields = fields
  }

  static create(fields: Partial<Conversion> = {}): ConversionBuilder {
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

  async save(ds: DataSource): Promise<Conversion> {
    return ds.getRepository(Conversion).save(this.fields)
  }
}
