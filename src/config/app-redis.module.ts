import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import Redis from 'ioredis'
import { AppConfig } from '@/config/app-config.service'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
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
  exports: [REDIS_CLIENT],
})
export class AppRedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown() {
    await this.redis.quit()
  }
}
