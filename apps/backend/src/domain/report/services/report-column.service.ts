import { Injectable } from '@nestjs/common'
import { FORMULA_NAMES } from '@/domain/report/formulas'
import { METRIC_NAMES } from '@/domain/report/metrics'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'

@Injectable()
export class ReportColumnService {
  public getMetricsNames(defaults: Set<string>): ColumnResponseDto[] {
    this.validateDefaults(defaults)

    return [
      ...this.transform(FORMULA_NAMES, defaults),
      ...this.transform(METRIC_NAMES, defaults),
    ]
  }

  private validateDefaults(defaults: Set<string>): void {
    const validKeys = new Set([
      ...Object.keys(FORMULA_NAMES),
      ...Object.keys(METRIC_NAMES),
    ])
    const unknown = [...defaults].filter((key) => !validKeys.has(key))
    if (unknown.length > 0) {
      throw new Error(`Unknown default columns: ${unknown.join(', ')}`)
    }
  }

  private transform<T extends string>(
    input: Record<T, string>,
    defaults: Set<string>,
  ): { column: T; name: string; default: boolean }[] {
    return Object.entries<string>(input).map(([column, name]) => ({
      column: column as T,
      name,
      default: defaults.has(column),
    }))
  }
}
