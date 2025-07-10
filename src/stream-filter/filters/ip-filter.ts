import { BaseFilterObject, StreamFilter } from '@/stream-filter/types'
import { inRange, isRange } from 'range_check'

export interface IpFilterObject extends BaseFilterObject {
  type: 'ip'
  values: string[]
}

export class IpFilter implements StreamFilter {
  constructor(
    private readonly filterObj: IpFilterObject,
    private readonly ip?: string,
  ) {}

  handle(): boolean {
    if (this.filterObj.values.length === 0) {
      return false
    }

    const ranges = this.filterObj.values.filter(isRange)

    if (!this.ip) {
      return false
    }

    return this.checkRange(ranges, this.ip)
  }

  private checkRange(ranges: string[], ip: string) {
    return ranges.every((range) => inRange(ip, range))
  }
}
