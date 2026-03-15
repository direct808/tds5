import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare name: string

  @ApiProperty()
  @IsUrl()
  declare url: string

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  declare affiliateNetworkId?: string
}
