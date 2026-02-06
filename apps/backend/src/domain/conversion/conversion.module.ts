import { Module } from '@nestjs/common'
import { ConversionController } from './conversion.controller'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { ConversionTypeService } from './conversion-type.service'
import { ConversionListener } from './listeners/conversion.listener'
import { ConversionRegisterUseCase } from './use-cases/conversion-register.use-case'
import { ConversionTypeIterator } from './conversion-type.iterator'

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
