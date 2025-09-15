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
  declare name: string

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  declare url: string

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  declare affiliateNetworkId: string
}
