import { Campaign } from '../../src/campaign/entity/campaign.entity'
import {
  CampaignStreamSchema,
  Stream,
  StreamActionType,
} from '../../src/campaign/entity/stream.entity'
import { StreamOffer } from '../../src/campaign/entity/stream-offer.entity'

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

export const streamOfferFixtures: Partial<StreamOffer>[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    offerId: '00000000-0000-4000-8000-000000000001',
    percent: 60,
    active: true,
    streamId: '00000000-0000-4000-8000-000000000001',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    offerId: '00000000-0000-4000-8000-000000000002',
    percent: 40,
    active: true,
    streamId: '00000000-0000-4000-8000-000000000001',
  },
]
