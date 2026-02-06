import { StreamBuilder, StreamFull } from './stream-builder'
import { CampaignBuilder } from '../campaign-builder'
import { StreamActionTypeEnum, StreamSchemaEnum } from '@generated/prisma/enums'
import { PrismaClient } from '@generated/prisma/client'
import { CampaignModel } from '@generated/prisma/models/Campaign'

export class StreamTypeActionBuilder extends StreamBuilder {
  private actionCampaignBuilder?: CampaignBuilder

  constructor() {
    super()
    this.fields.schema = StreamSchemaEnum.ACTION
  }

  type(type: StreamActionTypeEnum): this {
    this.fields.actionType = type

    return this
  }

  content(actionContent: string): this {
    this.fields.actionContent = actionContent

    return this
  }

  createActionCampaign(callback: (builder: CampaignBuilder) => void): void {
    const builder = CampaignBuilder.create()
    this.actionCampaignBuilder = builder
    callback(builder)
  }

  async save(prisma: PrismaClient, campaignId: string): Promise<StreamFull> {
    let actionCampaign: CampaignModel | null = null
    if (this.actionCampaignBuilder) {
      const campaign = await this.actionCampaignBuilder.save(prisma)
      this.fields.actionCampaignId = campaign.id
      actionCampaign = campaign
    }

    const res = await super.save(prisma, campaignId)
    res.actionCampaign = actionCampaign

    return res
  }
}
