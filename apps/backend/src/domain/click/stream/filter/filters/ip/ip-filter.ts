import { BaseFilterObject, StreamFilter } from '../../types'
import { isIP } from 'class-validator'
import { isNullable } from '@/shared/helpers'

export interface IpFilterObject extends BaseFilterObject {
  type: 'ip'
  values: string[]
}

export class IpFilter implements StreamFilter {
  constructor(
    private readonly filterObj: IpFilterObject,
    private readonly ip: string | null | undefined,
  ) {}

  handle: StreamFilter['handle'] = () => {
    if (this.filterObj.values.length === 0) {
      return false
    }

    if (isNullable(this.ip)) {
      return false
    }

    for (const range of this.filterObj.values) {
      if (isIP(range)) {
        return range === this.ip
      }

      const splitted = this.splitRange(range)

      if (!splitted) {
        continue
      }

      const from = this.ipToNumber(splitted[0])
      const to = this.ipToNumber(splitted[1])

      const ip = this.ipToNumber(this.ip)

      if (ip >= from && ip <= to) {
        return true
      }
    }

    return false
  }

  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
  }

  private splitRange(range: string): [string, string] | undefined {
    const res = range.split('-').map((item) => item.trim())
    if (res.length === 2) {
      return res as [string, string]
    }
  }
}
