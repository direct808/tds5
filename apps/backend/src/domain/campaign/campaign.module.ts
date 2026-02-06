import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CampaignService } from './campaign.service'
import { UpdateCampaignUseCase } from './use-cases/update-campaign.use-case'
import { UpdateStreamService } from './stream/update-stream.service'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service'
import { CreateStreamService } from './stream/create-stream.service'
import { StreamService } from './stream/stream.service'
import { StreamRepository } from './stream/stream.repository'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { CreateCampaignUseCase } from './use-cases/create-campaign.use-case'
import { ReportModule } from '../report/report.module'
import { ListCampaignUseCase } from './use-cases/list-campaign.use-case'

@Module({
  controllers: [CampaignController],
  imports: [RepositoryModule, ReportModule],
  providers: [
    CampaignService,
    CreateCampaignUseCase,
    UpdateCampaignUseCase,
    UpdateStreamService,
    CreateStreamOfferService,
    CreateStreamService,
    StreamService,
    StreamRepository,
    UpdateStreamOfferService,
    CommonStreamOfferService,
    ListCampaignUseCase,
  ],
})
export class CampaignModule {}
