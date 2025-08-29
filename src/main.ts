import { APP_INTERCEPTOR, NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './utils/configure-app'
import { AppConfig } from './config/app-config.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import KeyvRedis from '@keyv/redis'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureApp(app)

  const config = app.get(AppConfig)
  const logger = new Logger()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания траффика')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)

  //constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // const cache = app.get<Cache>(CACHE_MANAGER)
  //
  // await cache.set('asdas', 234234)
  //
  // const store = cache.stores[0]
  // const client: KeyvRedis<any> = store.store
  // const cl = client.client
  //
  // await cl.hSet('key', 'field', 'asdas')
  // // await cl.('key', 'field', 'asdas')
  // await cl.sAdd('users:1:tokens', 'Tm9kZSBSZWRpcw==')
}

void bootstrap()
