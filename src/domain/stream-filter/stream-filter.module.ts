import { Module } from '@nestjs/common'
import { StreamFilterService } from '@/domain/stream-filter/stream-filter.service'
import { StreamFilterFactory } from '@/domain/stream-filter/stream-filter-factory'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  imports: [ClickSharedModule, RepositoryModule],
  providers: [StreamFilterService, StreamFilterFactory],
  exports: [StreamFilterService],
})
export class StreamFilterModule {}
