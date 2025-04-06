import { Module } from '@nestjs/common'
import { SourceModule } from './source'

@Module({
  imports: [SourceModule],
})
export class AppModule {}
