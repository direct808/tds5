import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateStreamDto } from './create-stream.dto'

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  declare name: string

  @IsUUID('4')
  @IsOptional()
  sourceId?: string

  @IsUUID('4')
  @IsOptional()
  domainId?: string

  @IsBoolean()
  declare active: boolean

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateStreamDto)
  declare streams: CreateStreamDto[]
}
