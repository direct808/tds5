import { ClickData } from '@/click/click-data'
import { StreamFilter, TextFilterObject } from '@/stream-filter/types'

export class IpFilter implements StreamFilter {
  constructor(
    private readonly filterObj: TextFilterObject,
    private readonly clickData: ClickData,
    private readonly key: keyof ClickData,
  ) {}

  handle(): boolean {
    const values = this.filterObj.values

    if (values.length === 0) {
      return false
    }

    return values.includes(this.clickData[this.key]?.toString() || '')
  }
}
