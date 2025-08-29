import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '@/source/events/source-updated.event'
import { CacheCampaignProvider } from '@/click/campaign-provider/cache-campaign.provider'

@Injectable()
export class CampaignDependencyListener {
  constructor(private readonly cacheCampaignProvider: CacheCampaignProvider) {}

  @OnEvent(sourceUpdateEventName)
  handleSourceUpdatedEvent({ sourceId }: SourceUpdatedEvent) {
    return this.cacheCampaignProvider.clearCacheBySourceId(sourceId)
  }
}
