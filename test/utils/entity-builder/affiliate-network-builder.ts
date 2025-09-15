import { DataSource } from 'typeorm'
import { AffiliateNetwork } from '@/domain/affiliate-network/affiliate-network.entity'

export class AffiliateNetworkBuilder {
  private fields: Partial<AffiliateNetwork> = {}

  private constructor() {}

  public static create(): AffiliateNetworkBuilder {
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

  offerParams(offerParams: string): this {
    this.fields.offerParams = offerParams

    return this
  }

  async save(ds: DataSource): Promise<AffiliateNetwork> {
    return ds.getRepository(AffiliateNetwork).save(this.fields)
  }
}
