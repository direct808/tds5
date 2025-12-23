export const affiliateNetworkUpdatedEventName = 'affiliateNetwork.updated'

export class AffiliateNetworkUpdatedEvent {
  constructor(public readonly affiliateNetworkId: string) {}
}
