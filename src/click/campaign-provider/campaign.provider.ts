import { FullCampaign } from '@/campaign/types'

export interface CampaignProvider {
  getFullByCode(code: string): Promise<FullCampaign>
}
