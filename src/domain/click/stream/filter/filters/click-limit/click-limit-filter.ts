import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/filter/types'

export interface ClickLimitFilterObj extends BaseFilterObject {
  type: 'click-limit'
  perHour?: number
  perDay?: number
  total?: number
}

export interface ClickLimitProvider {
  getCountPerHour(campaignId: string): Promise<number>
  getCountPerDay(campaignId: string): Promise<number>
  getCountTotal(campaignId: string): Promise<number>
}

export class ClickLimitFilter implements StreamFilter {
  constructor(
    private readonly filterObj: ClickLimitFilterObj,
    private readonly provider: ClickLimitProvider,
    private readonly campaignId: string,
  ) {}

  handle: StreamFilter['handle'] = async () => {
    const [checkPerHour, checkPerDay, checkTotal] = await Promise.all([
      this.check('getCountPerHour', 'perHour'),
      this.check('getCountPerDay', 'perDay'),
      this.check('getCountTotal', 'total'),
    ])

    return checkPerHour && checkPerDay && checkTotal
  }

  private async check<
    M extends keyof ClickLimitProvider,
    K extends keyof Pick<ClickLimitFilterObj, 'perHour' | 'perDay' | 'total'>,
  >(methodName: M, key: K): Promise<boolean> {
    const value = this.filterObj[key]
    if (!value) {
      return true
    }
    const count = await this.provider[methodName](this.campaignId)

    return count < value
  }
}
