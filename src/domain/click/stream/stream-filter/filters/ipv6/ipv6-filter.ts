import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/stream-filter/types'
import { isV6 } from 'range_check'

export interface IpV6FilterObject extends BaseFilterObject {
  type: 'ipv6'
}

export class IpV6Filter implements StreamFilter {
  constructor(private readonly ip?: string) {}

  handle(): boolean {
    if (!this.ip) {
      return false
    }

    return isV6(this.ip)
  }
}
