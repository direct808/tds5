import { Module } from '@nestjs/common'
import { DomainController } from './domain.controller'
import { CreateDomainUseCase } from './use-cases/create-domain-use-case.service'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { ListDomainUseCase } from './use-cases/list-domain-use-case.service'
import { DomainService } from './domain.service'
import { UpdateDomainUseCase } from './use-cases/update-domain-use-case.service'
import { DeleteDomainUseCase } from './use-cases/delete-domain-use-case.service'

@Module({
  controllers: [DomainController],
  providers: [
    DomainService,
    CreateDomainUseCase,
    ListDomainUseCase,
    UpdateDomainUseCase,
    DeleteDomainUseCase,
  ],
  imports: [RepositoryModule],
})
export class DomainModule {}
