import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare name: string

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  declare url: string

  @ApiPropertyOptional({ type: 'string' })
  @IsUUID()
  @IsOptional()
  declare affiliateNetworkId?: string
}
