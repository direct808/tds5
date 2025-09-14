import { Module, OnApplicationShutdown } from '@nestjs/common'
import Redis from 'ioredis'
import { AppConfig } from '@/config/app-config.service'
import { RedisProvider } from './redis.provider'

@Module({
  providers: [
    RedisProvider,
    {
      provide: Redis,
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
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

  async onApplicationShutdown() {
    await this.redis.quit()
  }
}
