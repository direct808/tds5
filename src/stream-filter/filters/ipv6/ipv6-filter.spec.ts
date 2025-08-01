import { IpV6Filter } from './ipv6-filter'

describe('IpV6Filter', () => {
  it.each([
    [undefined, false],
    ['22.33.43.2', false],
    ['2001:db8::1', true],
  ])('Should pass all tests', async (ip, expected) => {
    const filter = new IpV6Filter(ip)

    const result = filter.handle()

    expect(result).toBe(expected)
  })
})
