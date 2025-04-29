import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { StreamInputDto } from './stream-input.dto'

export class CampaignCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUUID('4')
  @IsOptional()
  sourceId?: string

  @IsBoolean()
  active = true

  @IsArray()
  @ValidateNested()
  @Type(() => StreamInputDto)
  streams: StreamInputDto[] = []
}
