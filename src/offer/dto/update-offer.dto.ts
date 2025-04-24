import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  url: string

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  affiliateNetworkId: string
}
