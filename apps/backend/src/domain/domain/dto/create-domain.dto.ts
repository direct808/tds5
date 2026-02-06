import { IsBoolean, IsFQDN, IsOptional, IsUUID } from 'class-validator'

export class CreateDomainDto {
  @IsFQDN()
  declare name: string

  @IsUUID()
  @IsOptional()
  declare indexPageCampaignId?: string

  @IsBoolean()
  @IsOptional()
  declare intercept404?: boolean
}
