type CacheKeyResult = (id: string) => string
type CacheKeysResult = (id: string[]) => string[]

export const offerCacheKey: CacheKeyResult = (id: string) =>
  `offer:${id}:campaignCodes`

export const sourceCacheKey: CacheKeyResult = (id: string) =>
  `source:${id}:campaignCodes`

export const fullCampaignCodeCacheKey: CacheKeyResult = (code: string) =>
  `fullCampaignCode:${code}`

export const fullCampaignDomainCacheKey: CacheKeyResult = (domain: string) =>
  `fullCampaignDomain:${domain}`

export const affiliateNetworkCacheKey: CacheKeyResult = (id: string) =>
  `affiliateNetwork:${id}:campaignCodes`

// Array

export const fullCampaignCodeCacheKeys: CacheKeysResult = (code: string[]) =>
  code.map((code) => `fullCampaignCode:${code}`)

export const fullCampaignDomainCacheKeys: CacheKeysResult = (
  domain: string[],
) => domain.map((domain) => `fullCampaignDomain:${domain}`)
