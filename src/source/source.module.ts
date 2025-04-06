import { Module } from '@nestjs/common'
import { SourceController } from './source.controller'
import { SourceRepository } from './source.repository'
import { SourceService } from './source.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Source } from './source.entity'

@Module({
  controllers: [SourceController],
  providers: [SourceRepository, SourceService],
  imports: [TypeOrmModule.forFeature([Source])],
})
export class SourceModule {}
