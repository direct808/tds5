import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

export function configureApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser())
}
