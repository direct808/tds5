import { ConversionBuilder } from './conversion-builder'
import { faker } from '@faker-js/faker/.'
import {
  ClickGetPayload,
  ClickModel,
  ClickUncheckedCreateInput,
} from '@generated/prisma/models/Click'
import { PrismaClient } from '@generated/prisma/client'

export function createClickBuilder(
  fields = {} as Partial<ClickUncheckedCreateInput>,
): ClickBuilder {
  return ClickBuilder.create(fields)
}

export class ClickBuilder {
  private readonly fields = {} as Partial<ClickUncheckedCreateInput>

  private readonly conversions: ConversionBuilder[] = []

  private constructor(fields = {} as Partial<ClickUncheckedCreateInput>) {
    this.fields = structuredClone(fields)
    this.fields.id = faker.string.alphanumeric(12)
    this.fields.visitorId = faker.string.alphanumeric(6)
  }

  static create(
    fields = {} as Partial<ClickUncheckedCreateInput>,
  ): ClickBuilder {
    return new this(fields)
  }

  addConv(cb: (builder: ConversionBuilder) => void): this {
    const builder = ConversionBuilder.create()
    this.conversions.push(builder)
    cb(builder)

    return this
  }

  id(id: string): this {
    this.fields.id = id

    return this
  }

  campaignId(campaignId: string): this {
    this.fields.campaignId = campaignId

    return this
  }

  streamId(streamId: string): this {
    this.fields.streamId = streamId

    return this
  }

  visitorId(visitorId: string): this {
    this.fields.visitorId = visitorId

    return this
  }

  cost(cost: number): this {
    this.fields.cost = cost

    return this
  }

  createdAt(createdAt: Date): this {
    this.fields.createdAt = createdAt

    return this
  }

  isBot(isBot: boolean | null): this {
    this.fields.isBot = isBot

    return this
  }

  isUniqueGlobal(isUniqueGlobal: boolean | null): this {
    this.fields.isUniqueGlobal = isUniqueGlobal

    return this
  }

  isUniqueCampaign(isUniqueCampaign: boolean | null): this {
    this.fields.isUniqueCampaign = isUniqueCampaign

    return this
  }

  isUniqueStream(isUniqueStream: boolean | null): this {
    this.fields.isUniqueStream = isUniqueStream

    return this
  }

  isProxy(isProxy: boolean | null): this {
    this.fields.isProxy = isProxy

    return this
  }

  referer(referer: string | null): this {
    this.fields.referer = referer

    return this
  }

  country(country: string | null): this {
    this.fields.country = country

    return this
  }

  async save(prisma: PrismaClient): Promise<ClickModel> {
    const click = (await prisma.click.create({
      data: this.fields as ClickUncheckedCreateInput,
    })) as ClickGetPayload<{ include: { conversions: true } }>

    click.conversions = []
    for (const builder of this.conversions) {
      const conversion = await builder.clickId(click.id).save(prisma)
      click.conversions.push(conversion)
    }

    return click
  }
}
