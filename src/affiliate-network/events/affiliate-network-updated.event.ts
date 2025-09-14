export const affiliateNetworkEventName = 'affiliateNetwork.updated'

export class AffiliateNetworkUpdatedEvent {
  constructor(public readonly affiliateNetworkId: string) {}
}
