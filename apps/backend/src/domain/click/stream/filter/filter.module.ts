import { Module } from '@nestjs/common'
import { FilterService } from './filter.service'
import { FilterFactory } from './filter-factory'
import { ClickSharedModule } from '../../shared/click-shared.module'
import { RepositoryModule } from '../../../../infra/repositories/repository.module'

@Module({
  imports: [ClickSharedModule, RepositoryModule],
  providers: [FilterService, FilterFactory],
  exports: [FilterService],
})
export class FilterModule {}
