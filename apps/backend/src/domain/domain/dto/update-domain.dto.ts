import { IsBoolean, IsOptional, IsUUID } from 'class-validator'

export class UpdateDomainDto {
  @IsUUID()
  @IsOptional()
  declare indexPageCampaignId?: string

  @IsBoolean()
  @IsOptional()
  declare intercept404?: boolean
}
