import { StreamBuilder } from './stream-builder.js'
import {
  CampaignStreamSchema,
  Stream,
  StreamActionType,
} from '@/campaign/entity/stream.entity.js'
import { CampaignBuilder } from '../campaign-builder.js'
import { DataSource } from 'typeorm'

export class StreamTypeActionBuilder extends StreamBuilder {
  private actionCampaignBuilder?: CampaignBuilder

  constructor() {
    super()
    this.fields.schema = CampaignStreamSchema.ACTION
  }

  type(type: StreamActionType) {
    this.fields.actionType = type
    return this
  }

  content(actionContent: string) {
    this.fields.actionContent = actionContent
    return this
  }

  createActionCampaign(callback: (builder: CampaignBuilder) => void) {
    const builder = new CampaignBuilder()
    this.actionCampaignBuilder = builder
    callback(builder)
  }

  async save(ds: DataSource, campaignId: string): Promise<Stream> {
    if (this.actionCampaignBuilder) {
      const campaign = await this.actionCampaignBuilder.save(ds)
      this.fields.actionCampaignId = campaign.id
      this.fields.actionCampaign = campaign
    }

    return super.save(ds, campaignId)
  }
}
