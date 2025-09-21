import { Module } from '@nestjs/common'
import { ConversionController } from './conversion.controller'
import { ConversionService } from '@/domain/conversion/conversion.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ConversionStatusService } from '@/domain/conversion/conversion-status.service'

@Module({
  controllers: [ConversionController],
  providers: [ConversionService, ConversionStatusService],
  imports: [RepositoryModule],
})
export class ConversionModule {}
