import { Injectable } from '@nestjs/common'
import {
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorResult,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisHealthIndicator } from './redis.health-indicator'

type FnResult = Promise<HealthIndicatorResult>

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  check(): Promise<HealthCheckResult> {
    return this.health.check([
      (): FnResult => this.prismaIndicator.pingCheck('postgres', this.prisma),
      (): FnResult => this.redisIndicator.pingCheck('redis'),
    ])
  }
}
