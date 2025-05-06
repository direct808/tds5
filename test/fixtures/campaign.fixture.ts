import {
  Campaign,
  CampaignStreamSchema,
  Stream,
  StreamActionType,
} from '../../src/campaign'

export const campaignFixtures: Partial<Campaign>[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Campaign 1',
    code: '00001',
    active: true,
    userId: '00000000-0000-4000-8000-000000000001',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Campaign 2',
    code: '00002',
    active: true,
    userId: '00000000-0000-4000-8000-000000000001',
  },
]

export const streamFixtures: Partial<Stream>[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Stream 1',
    campaignId: '00000000-0000-4000-8000-000000000001',
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.NOTHING,
  },
]
