import { Controller, Get } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { HealthCheckResult } from '@nestjs/terminus'
import { SkipAuth } from '@/domain/auth/decorators/skip-auth.decorator'
import { HealthService } from './health.service'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { SkipCheckAdminCreated } from '@/domain/auth/decorators/skip-check-admin-created.decorator'

@ApiExcludeController()
@Controller(GLOBAL_PREFIX + 'health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SkipAuth()
  @SkipCheckAdminCreated()
  @Get()
  check(): Promise<HealthCheckResult> {
    return this.healthService.check()
  }
}
