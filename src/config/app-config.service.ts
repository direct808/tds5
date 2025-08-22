import { Expose } from 'class-transformer'
import { IsOptional, IsPort, IsString } from 'class-validator'

export class AppConfig {
  @IsPort()
  @Expose({ name: 'PORT' })
  declare port: string

  @IsString()
  @Expose({ name: 'SECRET' })
  declare secret: string

  @IsString()
  @Expose({ name: 'JWT_EXPIRES' })
  declare jwtExpires: string

  @IsString()
  @Expose({ name: 'DB_HOST' })
  declare dbHost: string

  @IsPort()
  @Expose({ name: 'DB_PORT' })
  declare dbPort: string

  @IsString()
  @Expose({ name: 'DB_USER' })
  declare dbUser: string

  @IsString()
  @Expose({ name: 'DB_PASS' })
  declare dbPass: string

  @IsString()
  @Expose({ name: 'DB_NAME' })
  declare dbName: string

  @IsString()
  @IsOptional()
  @Expose({ name: 'IP2LOCATION_TOKEN' })
  declare ip2LocationToken?: string
}
