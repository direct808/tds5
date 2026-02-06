import { Module } from '@nestjs/common'
import { AffiliateNetworkController } from './affiliate-network.controller'
import { AffiliateNetworkService } from './affiliate-network.service'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { ListAffiliateNetworkUseCase } from './use-cases/list-affiliate-network.use-case'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [RepositoryModule, ReportModule],
  controllers: [AffiliateNetworkController],
  providers: [AffiliateNetworkService, ListAffiliateNetworkUseCase],
})
export class AffiliateNetworkModule {}
