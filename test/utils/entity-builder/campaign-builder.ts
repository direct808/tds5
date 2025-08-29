import { Campaign } from '@/campaign/entity/campaign.entity'
import { DataSource } from 'typeorm'
import { StreamBuilder } from './stream-builder/stream-builder'
import { StreamTypeDirectUrlBuilder } from './stream-builder/stream-type-direct-url-builder'
import { StreamTypeActionBuilder } from './stream-builder/stream-type-action-builder'
import { StreamTypeOffersBuilder } from './stream-builder/stream-type-offers-builder'
import { Stream } from '@/campaign/entity/stream.entity'
import { SourceBuilder } from './source-builder'
import { Source } from '@/source/source.entity'
import { UserBuilder } from './user-builder'
import { User } from '@/user/user.entity'

type CampaignFields = Partial<
  Pick<Campaign, 'name' | 'code' | 'userId' | 'active' | 'sourceId'>
>

export class CampaignBuilder {
  private readonly streamBuilders: StreamBuilder[] = []
  private readonly fields: CampaignFields = { active: true }
  private sourceBuilder?: SourceBuilder
  private userBuilder?: UserBuilder

  private constructor() {}

  static create() {
    return new this()
  }

  public async save(ds: DataSource): Promise<Campaign> {
    const streams: Stream[] = []
    let source: Source | undefined
    let user: User | undefined

    if (this.userBuilder) {
      user = await this.userBuilder.save(ds)
      this.fields.userId = user.id
    }

    if (this.sourceBuilder) {
      source = await this.sourceBuilder.save(ds)
      this.fields.sourceId = source.id
    }

    const campaign = await ds.getRepository(Campaign).save(this.fields)
    for (const builder of this.streamBuilders) {
      const stream = await builder.save(ds, campaign.id)
      streams.push(stream)
    }
    campaign.streams = streams
    campaign.source = source

    if (user) {
      campaign.user = user
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
    callback: (builder: StreamTypeDirectUrlBuilder) => void,
  ) {
    const builder = new StreamTypeDirectUrlBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  public addStreamTypeAction(
    callback: (builder: StreamTypeActionBuilder) => void,
  ) {
    const builder = new StreamTypeActionBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  public addStreamTypeOffers(
    callback: (builder: StreamTypeOffersBuilder) => void,
  ) {
    const builder = new StreamTypeOffersBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  createSource(callback: (builder: SourceBuilder) => void) {
    const builder = SourceBuilder.create()
    this.sourceBuilder = builder
    callback(builder)

    return this
  }

  sourceId(value: string) {
    this.fields.sourceId = value

    return this
  }

  createUser(callback: (builder: UserBuilder) => void) {
    const builder = UserBuilder.create()
    this.userBuilder = builder
    callback(builder)

    return this
  }
}
