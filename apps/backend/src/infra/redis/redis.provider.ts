import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisProvider {
  public constructor(private readonly redis: Redis) {}

  public async set(
    key: string,
    value: string | Buffer | number,
  ): Promise<void> {
    await this.redis.set(key, value)
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  public sMembers(key: string): Promise<string[]> {
    return this.redis.smembers(key)
  }

  public async del(...args: string[]): Promise<void> {
    await this.redis.del(args)
  }

  public async sAdd(items: { key: string; value: string }[]): Promise<void> {
    if (items.length === 0) {
      return
    }
    const pipeline = this.redis.pipeline()
    items.forEach(({ key, value }) => pipeline.sadd(key, value))
    await pipeline.exec()
  }
}
