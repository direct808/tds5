import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateStreamOfferDto } from './create-stream-offer.dto'
import {
  CampaignStreamSchema,
  StreamActionType,
  StreamRedirectType,
} from '@/campaign/types'

export class CreateStreamDto {
  @IsString()
  @IsNotEmpty()
  declare name: string

  @IsEnum(CampaignStreamSchema)
  declare schema: CampaignStreamSchema

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === CampaignStreamSchema.ACTION,
  )
  @IsEnum(StreamActionType)
  actionType?: StreamActionType

  @ValidateIf(
    (data: CreateStreamDto) => data.actionType === StreamActionType.TO_CAMPAIGN,
  )
  @IsUUID('4')
  actionCampaignId?: string

  @ValidateIf((data: CreateStreamDto) =>
    [StreamActionType.SHOW_HTML, StreamActionType.SHOW_TEXT].includes(
      data.actionType!,
    ),
  )
  @IsString()
  actionContent?: string

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === CampaignStreamSchema.DIRECT_URL,
  )
  @IsEnum(StreamRedirectType)
  redirectType?: StreamRedirectType

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === CampaignStreamSchema.DIRECT_URL,
  )
  @IsUrl({ require_protocol: true })
  redirectUrl?: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStreamOfferDto)
  offers?: CreateStreamOfferDto[]
}
