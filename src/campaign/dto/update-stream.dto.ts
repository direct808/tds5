import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { CreateStreamDto } from './create-stream.dto'
import { UpdateStreamOfferDto } from './update-stream-offer.dto'
import { Type } from 'class-transformer'

export class UpdateStreamDto extends CreateStreamDto {
  @IsUUID('4')
  id: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStreamOfferDto)
  offers: UpdateStreamOfferDto[] = []
}
