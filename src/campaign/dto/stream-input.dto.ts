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
import {
  CampaignStreamSchema,
  StreamActionType,
  StreamRedirectType,
} from '../entity'
import { StreamOfferInputDto } from './stream-offer-input.dto'

export class StreamInputDto {
  @IsUUID('4')
  @IsOptional()
  id?: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CampaignStreamSchema)
  schema: CampaignStreamSchema

  @ValidateIf(
    (data: StreamInputDto) => data.schema === CampaignStreamSchema.ACTION,
  )
  @IsEnum(StreamActionType)
  actionType?: StreamActionType

  @ValidateIf(
    (data: StreamInputDto) => data.actionType === StreamActionType.TO_CAMPAIGN,
  )
  @IsUUID('4')
  actionCampaignId?: string

  @ValidateIf((data: StreamInputDto) =>
    [StreamActionType.SHOW_HTML, StreamActionType.SHOW_TEXT].includes(
      data.actionType!,
    ),
  )
  @IsString()
  actionContent?: string

  @ValidateIf(
    (data: StreamInputDto) => data.schema === CampaignStreamSchema.DIRECT_URL,
  )
  @IsEnum(StreamRedirectType)
  redirectType?: StreamRedirectType

  @ValidateIf(
    (data: StreamInputDto) => data.schema === CampaignStreamSchema.DIRECT_URL,
  )
  @IsUrl({ require_protocol: true })
  redirectUrl?: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => StreamOfferInputDto)
  offers: StreamOfferInputDto[] = []
}
