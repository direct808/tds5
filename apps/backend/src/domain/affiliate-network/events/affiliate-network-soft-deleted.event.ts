export const affiliateNetworkSoftDeletedName = 'affiliate_network.soft_deleted'

export class AffiliateNetworkSoftDeletedEvent {
  constructor(public readonly affiliateNetworkIds: string[]) {}
}
