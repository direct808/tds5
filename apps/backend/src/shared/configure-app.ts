import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'

export function configureApp(app: NestExpressApplication): void {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser())
  app.set('trust proxy', true)
  app.enableCors()
}
