import { SkipCheckAdminCreated } from '@/domain/auth/decorators/skip-check-admin-created.decorator'
import { Controller, Get, Res } from '@nestjs/common'
import { PrometheusController } from '@willsoto/nestjs-prometheus'
import { SkipAuth } from '@/domain/auth/decorators/skip-auth.decorator'

@Controller()
export class MetricsController extends PrometheusController {
  @Get()
  @SkipCheckAdminCreated()
  @SkipAuth()
  index(@Res({ passthrough: true }) response: Response): Promise<string> {
    return super.index(response)
  }
}
