import { Module, OnApplicationShutdown } from '@nestjs/common'
import Redis from 'ioredis'
import { RedisProvider } from './redis.provider'
import { AppConfig } from '../config/app-config.service'

@Module({
  providers: [
    RedisProvider,
    {
      provide: Redis,
      inject: [AppConfig],
      useFactory: (config: AppConfig): Redis => {
        return new Redis({
          host: config.redisHost,
          port: +config.redisPort,
          db: +config.redisDb,
          password: config.redisPassword,
        })
      },
    },
  ],
  exports: [RedisProvider],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await this.redis.quit()
  }
}
