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
  name: string

  @ApiProperty()
  @IsUrl()
  url: string

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  affiliateNetworkId: string
}
