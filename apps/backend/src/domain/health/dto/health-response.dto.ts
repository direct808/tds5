import { ApiProperty } from '@nestjs/swagger'

export type HealthStatus = 'ok' | 'error'

export class HealthResponseDto {
  @ApiProperty({ enum: ['ok', 'error'] })
  declare status: HealthStatus

  @ApiProperty({ enum: ['ok', 'error'] })
  declare postgres: HealthStatus

  @ApiProperty({ enum: ['ok', 'error'] })
  declare redis: HealthStatus
}
