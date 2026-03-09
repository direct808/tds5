import { Module } from '@nestjs/common'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { MetricsController } from '@/infra/metrics/metrics.controller'

@Module({
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
    }),
  ],
})
export class MetricsModule {}
