import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetAffiliateNetworkByIdResponseDto {
  @ApiProperty()
  @Expose()
  declare id: string

  @ApiProperty()
  @Expose()
  declare name: string

  @ApiPropertyOptional({ type: 'string', nullable: true })
  @Expose()
  declare offerParams: string | null
}
