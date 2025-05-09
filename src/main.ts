import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { configureApp } from './utils/configure-app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureApp(app)

  const config = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания траффика')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(3300)
}

void bootstrap()
