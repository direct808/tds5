export const campaignUpdateEventName = 'campaign.updated'

export class CampaignUpdatedEvent {
  constructor(public readonly campaignCode: string) {}
}
