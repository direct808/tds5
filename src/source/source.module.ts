import { Module } from '@nestjs/common'
import { SourceController } from './source.controller'
import { SourceRepository } from './source.repository'
import { SourceService } from './source.service'

@Module({
  controllers: [SourceController],
  providers: [SourceRepository, SourceService],
  exports: [SourceRepository],
})
export class SourceModule {}
