import { StreamBuilder, StreamFull } from './stream-builder/stream-builder'
import { StreamTypeDirectUrlBuilder } from './stream-builder/stream-type-direct-url-builder'
import { StreamTypeActionBuilder } from './stream-builder/stream-type-action-builder'
import { StreamTypeOffersBuilder } from './stream-builder/stream-type-offers-builder'
import { SourceBuilder } from './source-builder'
import { UserBuilder } from './user-builder'
import { faker } from '@faker-js/faker'
import { PrismaClient, StreamActionTypeEnum } from '@generated/prisma/client'
import {
  CampaignGetPayload,
  CampaignUncheckedCreateInput,
} from '@generated/prisma/models/Campaign'
import { SourceModel } from '@generated/prisma/models/Source'
import { UserModel } from '@generated/prisma/models/User'

export type CampaignFull = CampaignGetPayload<{
  include: {
    streams: {
      include: {
        streamOffers: {
          include: { offer: { include: { affiliateNetwork: true } } }
        }
        actionCampaign: true
      }
    }
    source: true
    user: true
  }
}>

export class CampaignBuilder {
  private readonly streamBuilders: StreamBuilder[] = []
  private readonly fields: CampaignUncheckedCreateInput = {
    active: true,
  } as CampaignUncheckedCreateInput

  private sourceBuilder?: SourceBuilder
  private userBuilder?: UserBuilder

  private constructor() {}

  static create(): CampaignBuilder {
    return new this()
  }

  static createRandomActionContent(): CampaignBuilder {
    const code = faker.string.alphanumeric(6)

    return CampaignBuilder.create()
      .name(faker.commerce.productName())
      .code(code)
      .addStreamTypeAction((stream) =>
        stream
          .name(faker.commerce.productName())
          .type(StreamActionTypeEnum.SHOW_TEXT)
          .content(faker.commerce.productName()),
      )
  }

  public async save(prisma: PrismaClient): Promise<CampaignFull> {
    const streams: StreamFull[] = []
    let source: SourceModel | null = null
    let user: UserModel | undefined

    if (this.userBuilder) {
      user = await this.userBuilder.save(prisma)
      this.fields.userId = user.id
    }

    if (this.sourceBuilder) {
      source = await this.sourceBuilder.save(prisma)
      this.fields.sourceId = source.id
    }

    const campaign = (await prisma.campaign.create({
      data: this.fields,
      include: { streams: true, source: true, user: true },
    })) as CampaignFull

    for (const builder of this.streamBuilders) {
      const stream = (await builder.save(prisma, campaign.id)) as StreamFull
      streams.push(stream)
    }

    campaign.streams = streams
    campaign.source = source

    if (user) {
      campaign.user = user
    }

    return campaign
  }

  name(value: string): CampaignBuilder {
    this.fields.name = value

    return this
  }

  code(value: string): CampaignBuilder {
    this.fields.code = value

    return this
  }

  active(active: boolean): CampaignBuilder {
    this.fields.active = active

    return this
  }

  userId(value: string): CampaignBuilder {
    this.fields.userId = value

    return this
  }

  public addStreamTypeDirectUrl(
    callback: (builder: StreamTypeDirectUrlBuilder) => void,
  ): CampaignBuilder {
    const builder = new StreamTypeDirectUrlBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  public addStreamTypeAction(
    callback: (builder: StreamTypeActionBuilder) => void,
  ): CampaignBuilder {
    const builder = new StreamTypeActionBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  public addStreamTypeOffers(
    callback: (builder: StreamTypeOffersBuilder) => void,
  ): CampaignBuilder {
    const builder = new StreamTypeOffersBuilder()
    this.streamBuilders.push(builder)
    callback(builder)

    return this
  }

  createSource(callback: (builder: SourceBuilder) => void): CampaignBuilder {
    const builder = SourceBuilder.create()
    this.sourceBuilder = builder
    callback(builder)

    return this
  }

  sourceId(value: string): CampaignBuilder {
    this.fields.sourceId = value

    return this
  }

  createUser(callback: (builder: UserBuilder) => void): CampaignBuilder {
    const builder = UserBuilder.create()
    this.userBuilder = builder
    callback(builder)

    return this
  }
}
