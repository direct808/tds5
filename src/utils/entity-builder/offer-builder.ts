import { Offer } from '../../offer/offer.entity'
import { DataSource } from 'typeorm'

export class OfferBuilder {
  private fields: Partial<Offer> = {}

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
    return ds.getRepository(Offer).save(this.fields)
  }
}
