import { Injectable } from '@nestjs/common'
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus'
import { RedisProvider } from '@/infra/redis/redis.provider'

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly redis: RedisProvider,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const check = this.healthIndicatorService.check(key)
    try {
      await this.redis.ping()

      return check.up()
    } catch {
      return check.down()
    }
  }
}
