import { FullCampaign } from '@/campaign/types'

export const FULL_CAMPAIGN_PROVIDER = Symbol('FULL_CAMPAIGN_PROVIDER')

export interface FullCampaignProvider {
  getFullByCode(code: string): Promise<FullCampaign>
}
