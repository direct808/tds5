import { Module } from '@nestjs/common'
import { GenerateSwaggerCommand } from './generate-swagger.command'

/** Module that provides the generate-swagger CLI command. */
@Module({
  providers: [GenerateSwaggerCommand],
})
export class GenerateSwaggerModule {}
