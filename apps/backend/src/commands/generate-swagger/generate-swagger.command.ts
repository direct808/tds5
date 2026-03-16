import { Command, CommandRunner } from 'nest-commander'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from '@nestjs/common'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { AppModule } from '@/app.module'
import { configureApp } from '@/shared/configure-app'
import { configureSwagger } from '@/shared/configure-swagger'

/** CLI command that generates swagger.json from the AppModule metadata. */
@Command({ name: 'generate-swagger' })
export class GenerateSwaggerCommand extends CommandRunner {
  private readonly logger = new Logger(GenerateSwaggerCommand.name)

  /**
   * Boots the full NestJS application, generates the OpenAPI document,
   * writes it to swagger.json in the current working directory, then closes the app.
   */
  async run(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
    })
    configureApp(app)

    const document = configureSwagger(app)
    const outputPath = path.join(process.cwd(), 'swagger.json')

    await fs.writeFile(outputPath, JSON.stringify(document, null, 2))
    this.logger.log(`Swagger JSON written to ${outputPath}`)

    await app.close()
  }
}
