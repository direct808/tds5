import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resolve } from 'node:path'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { AppConfig, nodeEnv } from './app-config.service'

function validate(config: Record<string, unknown>): AppConfig {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: nodeEnv() === 'test',
      envFilePath: resolve(process.cwd(), './.env'),
    }),
  ],
  providers: [
    {
      provide: AppConfig,
      useFactory(): AppConfig {
        // eslint-disable-next-line no-process-env
        return validate(process.env)
      },
    },
  ],
  exports: [AppConfig],
})
export class AppConfigModule {}
