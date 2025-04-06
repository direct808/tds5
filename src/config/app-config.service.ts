import { Expose } from 'class-transformer'
import { IsNumber, IsPort, IsString } from 'class-validator'

export class AppConfig {
  @IsPort()
  @Expose({ name: 'PORT' })
  port: string

  @IsString()
  @Expose({ name: 'DB_HOST' })
  dbHost: string

  @IsNumber()
  @Expose({ name: 'DB_PORT' })
  dbPort: number

  @IsString()
  @Expose({ name: 'DB_USER' })
  dbUser: string

  @IsString()
  @Expose({ name: 'DB_PASS' })
  dbPass: string

  @IsString()
  @Expose({ name: 'DB_NAME' })
  dbName: string
}
