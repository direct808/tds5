import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { CreateStreamDto } from './create-stream.dto.js'
import { UpdateStreamOfferDto } from './update-stream-offer.dto.js'
import { Type } from 'class-transformer'

export class UpdateStreamDto extends CreateStreamDto {
  @IsUUID('4')
  @IsOptional()
  id?: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStreamOfferDto)
  declare offers?: UpdateStreamOfferDto[]
}
