import { Campaign } from '../../campaign/entity/campaign.entity'
import { DataSource } from 'typeorm'
import { StreamBuilder } from './stream-builder/stream-builder'
import { StreamTypeDirectUrlBuilder } from './stream-builder/stream-type-direct-url-builder'
import { StreamTypeActionBuilder } from './stream-builder/stream-type-action-builder'
import { StreamTypeOffersBuilder } from './stream-builder/stream-type-offers-builder'

type CampaignFields = Partial<
  Pick<Campaign, 'name' | 'code' | 'userId' | 'active'>
>

export class CampaignBuilder {
  private readonly streamBuilders: StreamBuilder[] = []
  private readonly fields: CampaignFields = { active: true }

  static create() {
    return new this()
  }

  public async save(ds: DataSource) {
    const campaign = await ds.getRepository(Campaign).save(this.fields)
    for (const builder of this.streamBuilders) {
      await builder.save(ds, campaign.id)
    }
    return campaign
  }

  name(value: string) {
    this.fields.name = value
    return this
  }

  code(value: string) {
    this.fields.code = value
    return this
  }

  userId(value: string) {
    this.fields.userId = value
    return this
  }

  public addStreamTypeDirectUrl(
    fn: (builder: StreamTypeDirectUrlBuilder) => void,
  ) {
    const builder = new StreamTypeDirectUrlBuilder()
    this.streamBuilders.push(builder)
    fn(builder)
    return this
  }

  public addStreamTypeAction(fn: (builder: StreamTypeActionBuilder) => void) {
    const builder = new StreamTypeActionBuilder()
    this.streamBuilders.push(builder)
    fn(builder)
    return this
  }

  public addStreamTypeOffers(fn: (builder: StreamTypeOffersBuilder) => void) {
    const builder = new StreamTypeOffersBuilder()
    this.streamBuilders.push(builder)
    fn(builder)
    return this
  }
}
