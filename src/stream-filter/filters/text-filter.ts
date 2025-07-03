import { ClickData } from '@/click/click-data'
import { StreamFilter, TextFilterObject } from '@/stream-filter/types'

export class TextFilter implements StreamFilter {
  constructor(private readonly filterObj: TextFilterObject) {}

  handle(clickData: ClickData): boolean {
    const values = this.filterObj.values

    if (values.length === 0) {
      return false
    }

    return values.includes(clickData.referer || '')
  }
}
