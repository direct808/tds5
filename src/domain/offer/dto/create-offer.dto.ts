import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare name: string

  @ApiProperty()
  @IsUrl()
  declare url: string

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  declare affiliateNetworkId: string
}
