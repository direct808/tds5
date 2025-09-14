export const campaignCreatedEventName = 'campaign.created'

export class CampaignCreatedEvent {
  constructor(public readonly campaignCode: string) {}
}
