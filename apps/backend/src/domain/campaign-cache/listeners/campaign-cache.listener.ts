import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '../../source/events/source-updated.event'
import { CampaignCacheClearService } from '../campaign-cache-clear.service'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from '../../offer/events/offer-updated.event'
import {
  CampaignUpdatedEvent,
  campaignUpdateEventName,
} from '../../campaign/events/campaign-updated.event'
import {
  affiliateNetworkUpdatedEventName,
  AffiliateNetworkUpdatedEvent,
} from '../../affiliate-network/events/affiliate-network-updated.event'
import {
  CampaignCreatedEvent,
  campaignCreatedEventName,
} from '../../campaign/events/campaign-created.event'
import {
  DomainUpdatedEvent,
  domainUpdateEventName,
} from '../../domain/events/domain-updated.event'
import {
  SourceSoftDeletedEvent,
  sourceSoftDeletedEventName,
} from '@/domain/source/events/source-soft-deleted.event'
import {
  AffiliateNetworkSoftDeletedEvent,
  affiliateNetworkSoftDeletedName,
} from '@/domain/affiliate-network/events/affiliate-network-soft-deleted.event'
import {
  OfferSoftDeletedEvent,
  offerSoftDeletedEventName,
} from '@/domain/offer/events/offer-soft-deleted.event'
import {
  DomainSoftDeletedEvent,
  domainSoftDeletedEventName,
} from '@/domain/domain/events/domain-soft-deleted.event'

@Injectable()
export class CampaignCacheListener {
  private readonly logger = new Logger(CampaignCacheListener.name)
  constructor(private readonly clearCacheService: CampaignCacheClearService) {}

  @OnEvent(campaignCreatedEventName)
  handleCampaignCreatedEvent({
    campaignCode,
  }: CampaignCreatedEvent): Promise<void> {
    this.logger.debug('CampaignCreatedEvent: ' + campaignCode)

    return this.clearCacheService.clearByCampaignCode(campaignCode)
  }

  @OnEvent(campaignUpdateEventName)
  handleCampaignUpdatedEvent({
    campaignCode,
  }: CampaignUpdatedEvent): Promise<void> {
    this.logger.debug('CampaignUpdatedEvent: ' + campaignCode)

    return this.clearCacheService.clearByCampaignCode(campaignCode)
  }

  @OnEvent(sourceUpdateEventName)
  handleSourceUpdatedEvent({ sourceId }: SourceUpdatedEvent): Promise<void> {
    this.logger.debug('SourceUpdatedEvent: ' + sourceId)

    return this.clearCacheService.clearBySourceId(sourceId)
  }

  @OnEvent(sourceSoftDeletedEventName)
  handleSourceSoftDeletedEvent(data: SourceSoftDeletedEvent): Promise<void[]> {
    this.logger.debug('SourceSoftDeleteEvent: ' + data.sourceIds.join(','))

    return Promise.all(
      data.sourceIds.map((id) => this.clearCacheService.clearBySourceId(id)),
    )
  }

  @OnEvent(offerUpdateEventName)
  handleOfferUpdatedEvent({ offerId }: OfferUpdatedEvent): Promise<void> {
    this.logger.debug('OfferUpdatedEvent: ' + offerId)

    return this.clearCacheService.clearByOfferId(offerId)
  }

  @OnEvent(offerSoftDeletedEventName)
  handleOfferSoftDeletedEvent({
    offerIds,
  }: OfferSoftDeletedEvent): Promise<void[]> {
    this.logger.debug('OfferSoftDeletedEvent: ' + offerIds.join(','))

    return Promise.all(
      offerIds.map((id) => this.clearCacheService.clearByOfferId(id)),
    )
  }

  @OnEvent(affiliateNetworkUpdatedEventName)
  handleAffiliateNetworkUpdatedEvent({
    affiliateNetworkId,
  }: AffiliateNetworkUpdatedEvent): Promise<void> {
    this.logger.debug('AffiliateNetworkUpdatedEvent: ' + affiliateNetworkId)

    return this.clearCacheService.clearByAffiliateNetworkId(affiliateNetworkId)
  }

  @OnEvent(affiliateNetworkSoftDeletedName)
  handleAffiliateNetworkSoftDeletedEvent({
    affiliateNetworkIds: ids,
  }: AffiliateNetworkSoftDeletedEvent): Promise<void[]> {
    this.logger.debug('AffiliateNetworkSoftDeleteEvent: ' + ids.join(','))

    return Promise.all(
      ids.map((id) => this.clearCacheService.clearByAffiliateNetworkId(id)),
    )
  }

  @OnEvent(domainUpdateEventName)
  handleDomainUpdatedEvent({ name }: DomainUpdatedEvent): Promise<void> {
    this.logger.debug('DomainUpdatedEvent: ' + name)

    return this.clearCacheService.clearByDomainNames([name])
  }

  @OnEvent(domainSoftDeletedEventName)
  handleDomainSoftDeletedEvent({
    domainIds,
  }: DomainSoftDeletedEvent): Promise<void> {
    this.logger.debug('DomainSoftDeletedEvent: ' + domainIds.join(','))

    return this.clearCacheService.clearByDomainIds(domainIds)
  }
}
