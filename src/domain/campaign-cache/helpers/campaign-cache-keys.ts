type CacheKeyResult = (id: string) => string

export const offerCacheKey: CacheKeyResult = (id: string) =>
  `offer:${id}:campaignCodes`

export const sourceCacheKey: CacheKeyResult = (id: string) =>
  `source:${id}:campaignCodes`

export const fullCampaignCacheKey: CacheKeyResult = (code: string) =>
  `fullCampaign:${code}`

export const affiliateNetworkCacheKey: CacheKeyResult = (id: string) =>
  `affiliateNetwork:${id}:campaignCodes`
