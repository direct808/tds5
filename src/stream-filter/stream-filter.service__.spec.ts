import { StreamFilterService } from '@/stream-filter/stream-filter.service'
import { Test, TestingModule } from '@nestjs/testing'
import { FilterLogic, FilterObject } from '@/stream-filter/types'
import { MockRequestAdapter } from '@/utils/request-adapter'
import { StreamFilterFactory } from '@/stream-filter/filters/stream-filter-factory'

describe('StreamFilterService', () => {
  let service: StreamFilterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamFilterService, StreamFilterFactory],
    }).compile()

    service = module.get(StreamFilterService)
  })

  it('Should be true if items is empty', () => {
    const result = service.checkFilters(
      {
        logic: FilterLogic.And,
        items: [],
      },
      {},
      new MockRequestAdapter(),
    )

    expect(result).toBeTruthy()
  })

  it('Should be true if items is empty2', () => {
    const result = service.checkFilters(
      {
        logic: FilterLogic.And,
        items: [{ type: 'query-param', name: 'param', values: ['param'] }],
      },
      {},
      new MockRequestAdapter({ query: { param: 'param' } }),
    )

    expect(result).toBeTruthy()
  })

  it.each([
    [
      false,
      FilterLogic.And,
      'value 1',
      [
        {
          type: 'referer',
          values: [],
        },
      ],
    ],
    [
      false,
      FilterLogic.Or,
      'value 1',
      [
        {
          type: 'referer',
          values: [],
        },
      ],
    ],
    [true, FilterLogic.And, 'value 1', [item(['value 1', 'Other value'])]],
    [false, FilterLogic.And, 'value 2', [item(['value 1', 'Other value'])]],
    [true, FilterLogic.Or, 'value 1', [item(['value 1', 'Other value'])]],
    [false, FilterLogic.Or, 'value 2', [item(['value 1', 'Other value'])]],
    [
      false,
      FilterLogic.And,
      'value 2',
      [item(['value 1', 'value 2']), item(['value 3', 'value 4'])],
    ],
    [
      true,
      FilterLogic.And,
      'value 2',
      [item(['value 1', 'value 2']), item(['value 2', 'value 4'])],
    ],
    [
      true,
      FilterLogic.Or,
      'value 2',
      [item(['value 1', 'value 2']), item(['value 3', 'value 4'])],
    ],
  ])(
    'Should be %s if logic %s, values %s, value %s',
    (expected, logic, value, items) => {
      const result = service.checkFilters(
        { logic, items: items as FilterObject[] },
        { referer: value },
        new MockRequestAdapter(),
      )

      expect(result).toEqual(expected)
    },
  )
})

function item(values: string[]) {
  return {
    type: 'referer',
    // exclude: true,
    values,
  } as FilterObject
}

function gen() {
  for (const exclude of [true, false]) {
    for (const logic of [FilterLogic.And, FilterLogic.Or]) {
    }
  }
}
