import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import Redis from 'ioredis'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [],
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6389,
          db: +process.env.REDIS_DB!,
          // password: configService.get<string>('REDIS_PASSWORD'),
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
