import { IsOptional, IsUUID } from 'class-validator'
import { CreateStreamOfferDto } from './create-stream-offer.dto'

export class UpdateStreamOfferDto extends CreateStreamOfferDto {
  @IsUUID('4')
  @IsOptional()
  id?: string
}
