import { StreamBuilder } from './stream-builder'
import {
  CampaignStreamSchema,
  StreamActionType,
} from '../../../campaign/entity/stream.entity'
import { CampaignBuilder } from '../campaign-builder'
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

  async save(ds: DataSource, campaignId: string) {
    if (this.actionCampaignBuilder) {
      const campaign = await this.actionCampaignBuilder.save(ds)
      this.fields.actionCampaignId = campaign.id
    }

    return super.save(ds, campaignId)
  }
}
