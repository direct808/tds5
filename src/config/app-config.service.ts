import { Expose } from 'class-transformer'
import { IsPort, IsString } from 'class-validator'

export class AppConfig {
  @IsPort()
  @Expose({ name: 'PORT' })
  port: string

  @IsString()
  @Expose({ name: 'SECRET' })
  secret: string

  @IsString()
  @Expose({ name: 'JWT_EXPIRES' })
  jwtExpires: string

  @IsString()
  @Expose({ name: 'DB_HOST' })
  dbHost: string

  @IsPort()
  @Expose({ name: 'DB_PORT' })
  dbPort: string

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
