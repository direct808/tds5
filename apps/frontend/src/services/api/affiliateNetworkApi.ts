import {
  affiliateNetworkControllerCreateAffiliateNetwork,
  type AffiliateNetworkControllerCreateAffiliateNetworkData,
  affiliateNetworkControllerDeleteAffiliateNetwork,
  type AffiliateNetworkControllerDeleteAffiliateNetworkData,
  affiliateNetworkControllerListAffiliateNetworks,
  type AffiliateNetworkControllerListAffiliateNetworksData,
} from '../../shared/api/generated'

export const affiliateNetworkApi = {
  async create(
    options: AffiliateNetworkControllerCreateAffiliateNetworkData['body'],
  ) {
    const { data } =
      await affiliateNetworkControllerCreateAffiliateNetwork<true>({
        body: options,
      })

    return data
  },
  async list(
    options: AffiliateNetworkControllerListAffiliateNetworksData['query'],
  ) {
    const { data } =
      await affiliateNetworkControllerListAffiliateNetworks<true>({
        query: options,
      })

    return data
  },
  async delete(
    options: AffiliateNetworkControllerDeleteAffiliateNetworkData['body'],
  ): Promise<void> {
    await affiliateNetworkControllerDeleteAffiliateNetwork<true>({
      body: options,
    })
  },
}
