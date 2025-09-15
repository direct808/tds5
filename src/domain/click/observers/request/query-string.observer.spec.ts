import { QueryStringObserver } from '@/domain/click/observers/request/query-string.observer'
import { MockClickContext } from '../../../../../test/utils/mock-click-context.service'
import {
  MockRequestAdapter,
  MockRequestAdapterData,
} from '../../../../../test/utils/mock-request-adapter'

describe('QueryStringObserver', () => {
  let observer: QueryStringObserver

  beforeEach(() => {
    observer = new QueryStringObserver({} as any)
  })

  it('should correctly map request query parameters into ClickData', () => {
    const mockRequestData: MockRequestAdapterData = {
      headers: {
        referer: 'http://example.com',
        'user-agent': 'Mozilla/5.0',
      },
      ip: '127.0.0.1',
      query: {
        keyword: 'test_keyword',
        source: 'google',
        cost: '12.34',
        external_id: 'ext123',
        creative_id: 'crea456',
        ad_campaign_id: 'camp789',
        extra_param_1: 'extra1',
        extra_param_2: 'extra2',
        sub_id_1: 'sub1',
        sub_id_2: 'sub2',
      },
    }

    const clickContext = MockClickContext.create()
      .setRequestAdapter(MockRequestAdapter.create(mockRequestData))
      .createClickData()

    const observer = new QueryStringObserver(clickContext)

    observer.handle()

    expect(clickContext.getClickData()).toEqual({
      ip: '127.0.0.1',
      referer: 'http://example.com',
      userAgent: 'Mozilla/5.0',
      keyword: 'test_keyword',
      source: 'google',
      cost: 12.34,
      externalId: 'ext123',
      creativeId: 'crea456',
      adCampaignId: 'camp789',
      extraParam1: 'extra1',
      extraParam2: 'extra2',
      subId1: 'sub1',
      subId2: 'sub2',
    })
  })

  it('should return number when string is a valid number', () => {
    expect(observer['getCost']('12.34')).toBe(12.34)
    expect(observer['getCost']('12,34')).toBe(12.34)
    expect(observer['getCost']('string value')).toBeUndefined()
    expect(observer['getCost'](undefined)).toBeUndefined()
    expect(observer['getCost']('0')).toBe(0)
  })
})
