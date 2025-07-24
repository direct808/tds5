import { BaseFilterObject, StreamFilter } from '@/stream-filter/types'

export interface ClickLimitFilterObj extends BaseFilterObject {
  type: 'click-limit'
  perHour?: number
  perDay?: number
  total?: number
  campaignId: string
}

export interface ClickLimitProvider {
  getClickPerHour(campaignId: string): Promise<number>
  getClickPerDay(campaignId: string): Promise<number>
  getClickTotal(campaignId: string): Promise<number>
}

export class ClickLimitFilter implements StreamFilter {
  constructor(
    private readonly filterObj: ClickLimitFilterObj,
    private readonly provider: ClickLimitProvider,
  ) {}

  async handle(): Promise<boolean> {
    const [checkPerHour, checkPerDay, checkTotal] = await Promise.all([
      this.check('getClickPerHour', 'perHour'),
      this.check('getClickPerDay', 'perDay'),
      this.check('getClickTotal', 'total'),
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
    const count = await this.provider[methodName](this.filterObj.campaignId)
    return count <= value
  }
}
