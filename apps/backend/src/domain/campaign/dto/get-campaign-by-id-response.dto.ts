import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetCampaignByIdResponseDto {
  @ApiProperty()
  @Expose()
  declare id: string

  @ApiProperty()
  @Expose()
  declare name: string

  @ApiProperty()
  @Expose()
  declare code: string

  @ApiPropertyOptional({ type: 'string', nullable: true })
  @Expose()
  declare domainId: string | null

  @ApiPropertyOptional({ type: 'string', nullable: true })
  @Expose()
  declare sourceId: string | null

  @ApiProperty()
  @Expose()
  declare active: boolean
}
