import { Module } from '@nestjs/common'
import { SourceController } from './source.controller.js'
import { SourceRepository } from './source.repository.js'
import { SourceService } from './source.service.js'

@Module({
  controllers: [SourceController],
  providers: [SourceRepository, SourceService],
  exports: [SourceRepository],
})
export class SourceModule {}
