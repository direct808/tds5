export class ValueManager {
  private readonly _values: Map<unknown, string> = new Map()

  public add(value: unknown): string {
    let result = this._values.get(value)
    if (result) {
      return result
    }

    result = '$' + (this._values.size + 1)
    this._values.set(value, result)

    return result
  }

  public values(): unknown[] {
    return Array.from(this._values.keys())
  }
}
