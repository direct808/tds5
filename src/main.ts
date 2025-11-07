import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from '@/shared/configure-app'
import { AppConfig } from '@/infra/config/app-config.service'
import { ReportRepository } from '@/infra/repositories/report.repository'
import jsep from 'jsep'
import { inspect } from 'node:util'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  configureApp(app)

  const config = app.get(AppConfig)
  const logger = new Logger()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания траффика')
    .setVersion('1.0')
    .build()
  const documentFactory: () => OpenAPIObject = () =>
    SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)

  const expr =
    'cost / (conversions_lead + conversions_sale + conversions_rejected)'
  const ast = jsep(expr)
  // console.log(inspect(ast, false, 10))

  // await app.get(ReportRepository).getReport({
  //   metrics: [
  //     // 'clicks',
  //     // 'cr',
  //     // 'conversions',
  //     // 'conversions_sale',
  //     // 'conversions_lead',
  //     // 'cost',
  //     // 'cpa',
  //     // 'cpc',
  //     // 'cpl',
  //     // 'cr_regs_to_deps',
  //     'roi',
  //     // 'deposits',
  //   ],
  // })
}

void bootstrap()
