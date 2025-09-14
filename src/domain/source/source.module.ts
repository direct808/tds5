import { Module } from '@nestjs/common'
import { SourceController } from './source.controller'
import { SourceService } from './source.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  imports: [RepositoryModule],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
