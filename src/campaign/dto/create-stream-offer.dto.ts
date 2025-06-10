import { IsBoolean, IsInt, IsUUID, Max, Min } from 'class-validator'

export class CreateStreamOfferDto {
  @IsUUID('4')
  declare offerId: string

  @IsInt()
  @Min(1)
  @Max(100)
  declare percent: number

  @IsBoolean()
  declare active: boolean
}
