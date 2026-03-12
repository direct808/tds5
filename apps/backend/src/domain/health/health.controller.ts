import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger'
import { SkipAuth } from '@/domain/auth/decorators/skip-auth.decorator'
import { HealthService } from './health.service'
import { HealthResponseDto } from './dto/health-response.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'

@ApiTags('Здоровье')
@Controller(GLOBAL_PREFIX + 'health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SkipAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthResponseDto })
  check(): Promise<HealthResponseDto> {
    return this.healthService.check()
  }
}
