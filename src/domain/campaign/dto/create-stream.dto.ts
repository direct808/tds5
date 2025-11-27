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
  StreamActionTypeEnum,
  StreamRedirectTypeEnum,
  StreamSchemaEnum,
} from '../../../../generated/prisma/enums'

export class CreateStreamDto {
  @IsString()
  @IsNotEmpty()
  declare name: string

  @IsEnum(StreamSchemaEnum)
  declare schema: StreamSchemaEnum

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === StreamSchemaEnum.ACTION,
  )
  @IsEnum(StreamActionTypeEnum)
  actionType?: StreamActionTypeEnum

  @ValidateIf(
    (data: CreateStreamDto) =>
      data.actionType === StreamActionTypeEnum.TO_CAMPAIGN,
  )
  @IsUUID('4')
  actionCampaignId?: string

  @ValidateIf((data: CreateStreamDto) =>
    [StreamActionTypeEnum.SHOW_HTML, StreamActionTypeEnum.SHOW_TEXT].includes(
      // todo убери меня
      //@ts-ignore
      data.actionType,
    ),
  )
  @IsString()
  actionContent?: string

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === StreamSchemaEnum.DIRECT_URL,
  )
  @IsEnum(StreamRedirectTypeEnum)
  redirectType?: StreamRedirectTypeEnum

  @ValidateIf(
    (data: CreateStreamDto) => data.schema === StreamSchemaEnum.DIRECT_URL,
  )
  @IsUrl({ require_protocol: true })
  redirectUrl?: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStreamOfferDto)
  offers?: CreateStreamOfferDto[]
}
