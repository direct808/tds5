export const offerCacheKey = (id: string) => `offer:${id}:campaignCodes`
export const sourceCacheKey = (id: string) => `source:${id}:campaignCodes`
export const fullCampaignCacheKey = (code: string) => `fullCampaign:${code}`
export const affiliateNetworkCacheKey = (id: string) =>
  `affiliateNetwork:${id}:campaignCodes`
