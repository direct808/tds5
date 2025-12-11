import { Expose } from 'class-transformer'
import { IsInt, IsOptional, IsPort, IsString } from 'class-validator'
import { env } from 'prisma/config'

export const postbackKey = (): string => {
  return env('POSTBACK_KEY')
}
export const nodeEnv = (): string | undefined => {
  // eslint-disable-next-line no-process-env
  return process.env.NODE_ENV
}

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
  @Expose({ name: 'POSTBACK_KEY' })
  declare postbackKey: string

  @IsString()
  @Expose({ name: 'DATABASE_URL' })
  declare dbUrl: string

  @IsString()
  @IsOptional()
  @Expose({ name: 'IP2LOCATION_TOKEN' })
  declare ip2LocationToken?: string

  @IsString()
  @Expose({ name: 'REDIS_HOST' })
  declare redisHost: string

  @IsPort()
  @Expose({ name: 'REDIS_PORT' })
  declare redisPort: string

  @IsString()
  @Expose({ name: 'REDIS_PASSWORD' })
  declare redisPassword: string

  @IsInt()
  @Expose({ name: 'REDIS_DB' })
  declare redisDb: number
}
