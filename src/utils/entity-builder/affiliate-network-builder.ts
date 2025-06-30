import { DataSource } from 'typeorm'
import { AffiliateNetwork } from '../../affiliate-network/affiliate-network.entity'

export class AffiliateNetworkBuilder {
  private fields: Partial<AffiliateNetwork> = {}

  public static create() {
    return new this()
  }

  name(name: string) {
    this.fields.name = name
    return this
  }

  userId(userId: string) {
    this.fields.userId = userId
    return this
  }

  offerParams(offerParams: string) {
    this.fields.offerParams = offerParams
    return this
  }

  async save(ds: DataSource): Promise<AffiliateNetwork> {
    return ds.getRepository(AffiliateNetwork).save(this.fields)
  }
}
