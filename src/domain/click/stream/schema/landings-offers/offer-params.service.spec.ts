import { OfferParamsService } from './offer-params.service'

describe('offer-params.service.ts', () => {
  it.each([
    [
      'http://localhost:8080?self_param=param_a&click_id=abcdifg&camp_name=Camp+name%21postfix',
      'click_id={subid}&camp_name={campaign_name}postfix',
      'http://localhost:8080?self_param=param_a',
      'Camp name!',
      'abcdifg',
    ],
    [
      'http://localhost:8080?click_id=abcdifg',
      'click_id={subid}',
      'http://localhost:8080',
      'Camp name!',
      'abcdifg',
    ],
  ])('Test url %s', (expected, offerParams, url, campaignName, clickId) => {
    const service = new OfferParamsService()

    const result = service.buildOfferUrl({
      offerParams,
      url,
      paramData: { subid: clickId, campaign_name: campaignName },
    })

    expect(result).toBe(expected)
  })

  it.each([
    [
      '?param_a={value_a}text',
      [
        {
          key: '?param_a=',
          type: 1,
        },
        {
          key: 'value_a',
          type: 0,
        },
        {
          key: 'text',
          type: 1,
        },
      ],
    ],
    [
      '?param_a={value_a}{value_b}&param_b={value_c}text{value_d}',
      [
        {
          key: '?param_a=',
          type: 1,
        },
        {
          key: 'value_a',
          type: 0,
        },
        {
          key: 'value_b',
          type: 0,
        },
        {
          key: '&param_b=',
          type: 1,
        },
        {
          key: 'value_c',
          type: 0,
        },
        {
          key: 'text',
          type: 1,
        },
        {
          key: 'value_d',
          type: 0,
        },
      ],
    ],
  ])('split %s', (a, b) => {
    const service = new OfferParamsService()
    const arr = [...service['split'](a)]
    expect(arr).toStrictEqual(b)
  })
})
