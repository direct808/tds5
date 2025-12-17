import { Module } from '@nestjs/common'
import { DomainController } from '@/domain/domain/domain.controller'
import { CreateDomainUseCase } from '@/domain/domain/use-cases/create-domain-use-case.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  controllers: [DomainController],
  providers: [CreateDomainUseCase],
  imports: [RepositoryModule],
})
export class DomainModule {}
