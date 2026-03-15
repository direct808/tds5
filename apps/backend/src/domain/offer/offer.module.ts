import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ListOfferUseCase } from './use-cases/list-offer.use-case'
import { GetOfferColumnsUseCase } from './use-cases/get-offer-columns.use-case'
import { ReportModule } from '@/domain/report/report.module'
import { GetByIdUseCase } from '@/domain/offer/use-cases/get-by-id.use-case'

@Module({
  imports: [RepositoryModule, ReportModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    ListOfferUseCase,
    GetByIdUseCase,
    GetOfferColumnsUseCase,
  ],
})
export class OfferModule {}
