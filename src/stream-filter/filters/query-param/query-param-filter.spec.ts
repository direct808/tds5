import { QueryParamFilter } from '@/stream-filter/filters/query-param/query-param-filter'
import { MockRequestAdapter } from '@/utils/request-adapter'

describe('query-param-filter.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should return false is empty values', () => {
    // 1. Arrange
    const filter = new QueryParamFilter(
      {
        type: 'query-param',
        name: 'parameter-name',
        values: [],
      },
      MockRequestAdapter.create(),
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return false if no query param', () => {
    // 1. Arrange
    const filter = new QueryParamFilter(
      {
        type: 'query-param',
        name: 'parameter-name',
        values: ['Parameter value'],
      },
      MockRequestAdapter.create(),
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return true if query match with value', () => {
    // 1. Arrange
    const filter = new QueryParamFilter(
      {
        type: 'query-param',
        name: 'parameter-name',
        values: ['Parameter value'],
      },
      MockRequestAdapter.create({
        query: { 'parameter-name': 'Parameter value' },
      }),
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(true)
  })

  it('Should return false if query not match with value', () => {
    // 1. Arrange
    const filter = new QueryParamFilter(
      {
        type: 'query-param',
        name: 'parameter-name',
        values: ['Parameter other value'],
      },
      MockRequestAdapter.create({
        query: { 'parameter-name': 'Parameter value' },
      }),
    )

    // 2. Act
    const result = filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })
})
