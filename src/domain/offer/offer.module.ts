import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  imports: [RepositoryModule],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
