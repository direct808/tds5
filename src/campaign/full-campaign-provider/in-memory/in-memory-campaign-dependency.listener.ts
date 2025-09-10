import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '@/source/events/source-updated.event'
import { RedisFullCampaignProvider } from '@/campaign/full-campaign-provider/redis/redis-full-campaign-provider'

@Injectable()
export class InMemoryCampaignDependencyListener {
  constructor(
    private readonly cacheCampaignProvider: RedisFullCampaignProvider,
  ) {}

  @OnEvent(sourceUpdateEventName)
  handleSourceUpdatedEvent({ sourceId }: SourceUpdatedEvent) {
    return this.cacheCampaignProvider.clearCacheBySourceId(sourceId)
  }
}
