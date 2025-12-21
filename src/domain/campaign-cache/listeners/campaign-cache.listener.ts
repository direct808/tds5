import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '@/domain/source/events/source-updated.event'
import { CampaignCacheClearService } from '../campaign-cache-clear.service'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from '@/domain/offer/events/offer-updated.event'
import {
  CampaignUpdatedEvent,
  campaignUpdateEventName,
} from '@/domain/campaign/events/campaign-updated.event'
import {
  affiliateNetworkUpdatedEventName,
  AffiliateNetworkUpdatedEvent,
} from '@/domain/affiliate-network/events/affiliate-network-updated.event'
import {
  CampaignCreatedEvent,
  campaignCreatedEventName,
} from '@/domain/campaign/events/campaign-created.event'
import {
  DomainUpdatedEvent,
  domainUpdateEventName,
} from '@/domain/domain/events/domain-updated.event'

@Injectable()
export class CampaignCacheListener {
  private readonly logger = new Logger(CampaignCacheListener.name)
  constructor(private readonly clearCacheService: CampaignCacheClearService) {}

  @OnEvent(campaignCreatedEventName)
  handleCampaignCreatedEvent({
    campaignCode,
  }: CampaignCreatedEvent): Promise<void> {
    this.logger.debug('CampaignCreatedEvent: ' + campaignCode)

    return this.clearCacheService.clearCacheByCampaignCode(campaignCode)
  }

  @OnEvent(campaignUpdateEventName)
  handleCampaignUpdatedEvent({
    campaignCode,
  }: CampaignUpdatedEvent): Promise<void> {
    this.logger.debug('CampaignUpdatedEvent: ' + campaignCode)

    return this.clearCacheService.clearCacheByCampaignCode(campaignCode)
  }

  @OnEvent(sourceUpdateEventName)
  handleSourceUpdatedEvent({ sourceId }: SourceUpdatedEvent): Promise<void> {
    this.logger.debug('SourceUpdatedEvent: ' + sourceId)

    return this.clearCacheService.clearCacheBySourceId(sourceId)
  }

  @OnEvent(offerUpdateEventName)
  handleOfferUpdatedEvent({ offerId }: OfferUpdatedEvent): Promise<void> {
    this.logger.debug('OfferUpdatedEvent: ' + offerId)

    return this.clearCacheService.clearCacheByOfferId(offerId)
  }

  @OnEvent(affiliateNetworkUpdatedEventName)
  handleAffiliateNetworkUpdatedEvent({
    affiliateNetworkId,
  }: AffiliateNetworkUpdatedEvent): Promise<void> {
    this.logger.debug('AffiliateNetworkUpdatedEvent: ' + affiliateNetworkId)

    return this.clearCacheService.clearCacheByAffiliateNetworkId(
      affiliateNetworkId,
    )
  }

  @OnEvent(domainUpdateEventName)
  handleDomainUpdatedEvent({ name }: DomainUpdatedEvent): Promise<void> {
    this.logger.debug('DomainUpdatedEvent: ' + name)

    return this.clearCacheService.clearCacheByDomainName(name)
  }
}
