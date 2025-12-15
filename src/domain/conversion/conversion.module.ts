import { Module } from '@nestjs/common'
import { ConversionController } from './conversion.controller'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ConversionTypeService } from '@/domain/conversion/conversion-type.service'
import { ConversionListener } from '@/domain/conversion/listeners/conversion.listener'
import { ConversionRegisterUseCase } from '@/domain/conversion/use-cases/conversion-register.use-case'
import { ConversionTypeIterator } from '@/domain/conversion/conversion-type.iterator'

@Module({
  controllers: [ConversionController],
  providers: [
    ConversionTypeService,
    ConversionListener,
    ConversionRegisterUseCase,
    ConversionTypeIterator,
  ],
  imports: [RepositoryModule],
})
export class ConversionModule {}
