import { Module } from '@nestjs/common'
import { DomainController } from '@/domain/domain/domain.controller'
import { CreateDomainUseCase } from '@/domain/domain/use-cases/create-domain-use-case.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ListDomainUseCase } from '@/domain/domain/use-cases/list-domain-use-case.service'

@Module({
  controllers: [DomainController],
  providers: [CreateDomainUseCase, ListDomainUseCase],
  imports: [RepositoryModule],
})
export class DomainModule {}
