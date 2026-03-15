import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAffiliateNetworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  declare name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  declare offerParams: string | null
}
