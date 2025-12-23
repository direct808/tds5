import { Module } from '@nestjs/common'
import { DomainController } from '@/domain/domain/domain.controller'
import { CreateDomainUseCase } from '@/domain/domain/use-cases/create-domain-use-case.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ListDomainUseCase } from '@/domain/domain/use-cases/list-domain-use-case.service'
import { DomainService } from '@/domain/domain/domain.service'
import { UpdateDomainUseCase } from '@/domain/domain/use-cases/update-domain-use-case.service'
import { DeleteDomainUseCase } from '@/domain/domain/use-cases/delete-domain-use-case.service'

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
