import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '@/source/events/source-updated.event'
import { CampaignCacheClearService } from '../campaign-cache-clear.service'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from '@/offer/events/offer-updated.event'
import {
  CampaignUpdatedEvent,
  campaignUpdateEventName,
} from '@/campaign/events/campaign-updated.event'
import {
  affiliateNetworkEventName,
  AffiliateNetworkUpdatedEvent,
} from '@/affiliate-network/events/affiliate-network-updated.event'
import {
  CampaignCreatedEvent,
  campaignCreatedEventName,
} from '@/campaign/events/campaign-created.event'

@Injectable()
export class CampaignCacheListener {
  private readonly logger = new Logger(CampaignCacheListener.name)
  constructor(private readonly clearCacheService: CampaignCacheClearService) {}

  @OnEvent(campaignCreatedEventName)
  handleCampaignCreatedEvent({ campaignCode }: CampaignCreatedEvent) {
    this.logger.debug('CampaignCreatedEvent: ' + campaignCode)

    return this.clearCacheService.clearCacheByCampaignCode(campaignCode)
  }

  @OnEvent(campaignUpdateEventName)
  handleCampaignUpdatedEvent({ campaignCode }: CampaignUpdatedEvent) {
    this.logger.debug('CampaignUpdatedEvent: ' + campaignCode)

    return this.clearCacheService.clearCacheByCampaignCode(campaignCode)
  }

  @OnEvent(sourceUpdateEventName)
  handleSourceUpdatedEvent({ sourceId }: SourceUpdatedEvent) {
    this.logger.debug('SourceUpdatedEvent: ' + sourceId)

    return this.clearCacheService.clearCacheBySourceId(sourceId)
  }

  @OnEvent(offerUpdateEventName)
  handleOfferUpdatedEvent({ offerId }: OfferUpdatedEvent) {
    this.logger.debug('OfferUpdatedEvent: ' + offerId)

    return this.clearCacheService.clearCacheByOfferId(offerId)
  }

  @OnEvent(affiliateNetworkEventName)
  handleAffiliateNetworkUpdatedEvent({
    affiliateNetworkId,
  }: AffiliateNetworkUpdatedEvent) {
    this.logger.debug('AffiliateNetworkUpdatedEvent: ' + affiliateNetworkId)

    return this.clearCacheService.clearCacheByAffiliateNetworkId(
      affiliateNetworkId,
    )
  }
}
