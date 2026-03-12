import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisProvider } from '@/infra/redis/redis.provider'
import { HealthResponseDto, HealthStatus } from './dto/health-response.dto'

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisProvider,
  ) {}

  async check(): Promise<HealthResponseDto> {
    const [postgres, redis] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
    ])

    const status: HealthStatus = postgres === 'ok' && redis === 'ok' ? 'ok' : 'error'

    const response: HealthResponseDto = { status, postgres, redis }

    if (status === 'error') {
      throw new HttpException(response, HttpStatus.SERVICE_UNAVAILABLE)
    }

    return response
  }

  private async checkPostgres(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return 'ok'
    } catch {
      return 'error'
    }
  }

  private async checkRedis(): Promise<HealthStatus> {
    try {
      await this.redis.ping()
      return 'ok'
    } catch {
      return 'error'
    }
  }
}