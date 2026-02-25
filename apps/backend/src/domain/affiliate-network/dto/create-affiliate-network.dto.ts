import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAffiliateNetworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare name: string

  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  declare offerParams: string | null
}
