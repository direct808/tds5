import { ClickDataTextFilter } from '@/domain/click/stream/stream-filter/filters/click-data-text/click-data-text-filter'

describe('click-data-text-filter.ts', () => {
  it('Should return false if empty values', () => {
    // 1. Arrange
    const filter = new ClickDataTextFilter(
      {
        type: 'referer',
        values: [],
      },
      { referer: 'Value referer' },
      'referer',
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return true if value equal', () => {
    // 1. Arrange
    const filter = new ClickDataTextFilter(
      {
        type: 'referer',
        values: ['Value referer'],
      },
      { referer: 'Value referer' },
      'referer',
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(true)
  })

  it('Should return false if click data id undefined', () => {
    // 1. Arrange
    const filter = new ClickDataTextFilter(
      {
        type: 'referer',
        values: ['Value referer'],
      },
      {},
      'referer',
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })
})
