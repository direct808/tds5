import { IsBoolean, IsInt, IsUUID, Max, Min } from 'class-validator'

export class CreateStreamOfferDto {
  @IsUUID('4')
  offerId: string

  @IsInt()
  @Min(1)
  @Max(100)
  percent: number

  @IsBoolean()
  active: boolean
}
