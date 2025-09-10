import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { SourceModule } from '@/source/source.module'
import { UpdateStreamService } from './stream/update-stream.service'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service'
import { CreateStreamService } from './stream/create-stream.service'
import { CommonStreamService } from './stream/common-stream.service'
import { StreamRepository } from './stream/stream.repository'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service'
import { StreamOfferRepository } from './stream-offer/stream-offer.repository'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service'
import { OfferRepository } from '@/offer/offer.repository'
import { RedisFullCampaignProvider } from '@/campaign/full-campaign-provider/redis-full-campaign-provider'
import { ClearFullCampaignCacheListener } from '@/campaign/listeners/clear-full-campaign-cache.listener'
import { ClearFullCampaignCacheService } from '@/campaign/full-campaign-provider/clear-full-campaign-cache.service'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule],
  providers: [
    CommonCampaignService,
    CampaignRepository,
    CreateCampaignService,
    UpdateCampaignService,
    UpdateStreamService,
    CreateStreamOfferService,
    CreateStreamService,
    CommonStreamService,
    StreamRepository,
    UpdateStreamOfferService,
    StreamOfferRepository,
    CommonStreamOfferService,
    OfferRepository,
    RedisFullCampaignProvider,
    ClearFullCampaignCacheListener,
    ClearFullCampaignCacheService,
  ],
  exports: [CampaignRepository, RedisFullCampaignProvider],
})
export class CampaignModule {}
