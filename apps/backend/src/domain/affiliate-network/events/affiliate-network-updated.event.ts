export const affiliateNetworkUpdatedEventName = 'affiliate_network.updated'

export class AffiliateNetworkUpdatedEvent {
  constructor(public readonly affiliateNetworkId: string) {}
}
