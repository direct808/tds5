import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAffiliateNetworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  params?: string
}
