import { CreateCampaignDto } from './create-campaign.dto.js'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { UpdateStreamDto } from './update-stream.dto.js'
import { Type } from 'class-transformer'
import { OmitType } from '@nestjs/swagger'

export class UpdateCampaignDto extends OmitType(CreateCampaignDto, [
  'streams',
]) {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => UpdateStreamDto)
  declare streams: UpdateStreamDto[]
}
