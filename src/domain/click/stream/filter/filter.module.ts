import { Module } from '@nestjs/common'
import { FilterService } from '@/domain/click/stream/filter/filter.service'
import { FilterFactory } from '@/domain/click/stream/filter/filter-factory'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  imports: [ClickSharedModule, RepositoryModule],
  providers: [FilterService, FilterFactory],
  exports: [FilterService],
})
export class FilterModule {}
