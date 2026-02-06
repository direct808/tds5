import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { ListOfferUseCase } from './use-cases/list-offer.use-case'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [RepositoryModule, ReportModule],
  controllers: [OfferController],
  providers: [OfferService, ListOfferUseCase],
})
export class OfferModule {}
