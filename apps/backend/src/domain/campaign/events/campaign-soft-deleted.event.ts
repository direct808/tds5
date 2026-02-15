export const campaignSoftDeletedEventName = 'campaign.soft_deleted'

export class CampaignSoftDeletedEvent {
  constructor(public readonly campaignIds: string[]) {}
}
