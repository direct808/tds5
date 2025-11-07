export const groups = {
  country: {},
  city: {},
  region: {},

  adCampaignId: {},
  campaignId: {},
  previousCampaignId: {},
  id: {},
  offerId: {},
  affiliateNetworkId: {},
  trafficSourceId: {},
  streamId: {},

  year: { sql: `date_part('year', "createdAt")` },
  month: { sql: `to_char("createdAt", 'YYYY-MM')` },
  week: { sql: `date_part('week', "createdAt")` },
  weekday: { sql: `date_part('dow', "createdAt")` },
  day: { sql: `to_char("createdAt", 'YYYY-MM-DD')` },
  hour: { sql: `date_part('hour', "createdAt")` },
  day_hour: { sql: `to_char("createdAt", 'YYYY-MM-DD HH:00')` },

  // Landing Page
  // Source
  // Campaign
  // Flow
  // Uniq clicks (flow)
  // Date and time
  // LP click time
  // Destination
  // Uniq clicks (campaign)
  // Uniq clicks (global)
  // Empty refere
  // Landing clicked
  // Domain
  // Domain group
  // Campaign group
  // Landing page group
  // offer group
  // offer
  // Aff network
  // Site
  // X-Req-With
  // Referer
  // Search engine
  // Keyword
  // Visitor code
  // External ID
  // Creative ID
  //
  // Language
  // Bot
  // Device type
  //   User Agent
  // OS Logo
  // Operation system
  // OS version
  // Browser
  // Browser version
  // Device model
  // Browser logo
  // IP
  //
  // Using proxy
  // Connection type
  //   Mobile operator
  // ISP
  //
  // sub_id_1
  // sub_id_2
  //
  // IP 1.2.*.*
  // IP 1.2.3.*
}
