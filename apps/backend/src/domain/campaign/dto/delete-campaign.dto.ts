import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsString } from 'class-validator'

export class DeleteCampaignDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  declare ids: string[]
}
