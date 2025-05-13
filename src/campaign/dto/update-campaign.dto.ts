import { CreateCampaignDto } from './create-campaign.dto'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { UpdateStreamDto } from './update-stream.dto'
import { Type } from 'class-transformer'
import { OmitType } from '@nestjs/swagger'

export class UpdateCampaignDto extends OmitType(CreateCampaignDto, [
  'streams',
]) {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => UpdateStreamDto)
  streams: UpdateStreamDto[]
}
