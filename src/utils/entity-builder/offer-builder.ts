import { Offer } from '../../offer/offer.entity'
import { DataSource } from 'typeorm'
import { AffiliateNetworkBuilder } from './affiliate-network-builder'
import { AffiliateNetwork } from '../../affiliate-network/affiliate-network.entity'

export class OfferBuilder {
  private fields: Partial<Offer> = {}
  private affiliateNetworkBuilder: AffiliateNetworkBuilder | undefined

  name(name: string) {
    this.fields.name = name
    return this
  }

  url(name: string) {
    this.fields.url = name
    return this
  }

  userId(userId: string) {
    this.fields.userId = userId
    return this
  }

  async save(ds: DataSource): Promise<Offer> {
    let affiliateNetwork: AffiliateNetwork | undefined
    if (this.affiliateNetworkBuilder) {
      affiliateNetwork = await this.affiliateNetworkBuilder.save(ds)
      this.fields.affiliateNetworkId = affiliateNetwork.id
    }
    const offer = await ds.getRepository(Offer).save(this.fields)
    offer.affiliateNetwork = affiliateNetwork
    return offer
  }

  public createAffiliateNetwork(
    callback: (builder: AffiliateNetworkBuilder) => void,
  ) {
    const builder = new AffiliateNetworkBuilder()
    this.affiliateNetworkBuilder = builder
    callback(builder)
    return this
  }
}
