import { IpFilter } from './ip-filter'

describe('IpFilter', () => {
  it.each([
    [['22.33.1.1-22.33.44.255'], '22.33.43.2', true],
    [['22.33.1.1-22.33.44.255'], '22.33.46.2', false],
    [['22.33.1.1-22.33.44.2', '22.33.45.1-22.33.47.4'], '22.33.46.2', true],
    [['22.33.1.1-22.33.44.255'], undefined, false],
    [['22.33.1.1-22.33.44'], '22.33.46.2', false],
    [['non ip-string'], '22.33.46.2', false],
    [['non ip string'], '22.33.46.2', false],
    [[], '22.33.46.2', false],
  ])('Should pass all tests', async (values, ip, expected) => {
    const filter = new IpFilter({ type: 'ip', values }, ip)

    const result = filter.handle()

    expect(result).toBe(expected)
  })
})
