import { FilterService } from '@/domain/click/stream/filter/filter.service'
import { Test } from '@nestjs/testing'
import { FilterFactory } from '@/domain/click/stream/filter/filter-factory'
import { FilterLogic, FilterObject } from '@/domain/click/stream/filter/types'

function filterObject(exclude = false): FilterObject {
  return { type: 'keyword', values: ['Value'], exclude }
}

describe('stream-filter.service.ts', () => {
  let service: FilterService
  const handle = jest.fn()

  beforeEach(async () => {
    jest.resetAllMocks()
    const module = await Test.createTestingModule({
      providers: [
        FilterService,
        {
          provide: FilterFactory,
          useValue: {
            create: () => ({ handle }),
          },
        },
      ],
    }).compile()

    service = module.get(FilterService)
  })

  it.each([
    [true, [true, true], FilterLogic.And],
    [false, [true, false], FilterLogic.And],
    [false, [false, false], FilterLogic.And],

    [true, [true, true], FilterLogic.Or],
    [true, [true, false], FilterLogic.Or],
    [false, [false, false], FilterLogic.Or],
  ])('exclude=false', async (expected, values, logic) => {
    values.forEach((value) => handle.mockReturnValueOnce(value))

    const result = await service.checkFilters(
      {
        logic,
        items: values.map(() => filterObject()),
      },
      'stream-id',
    )

    expect(result).toEqual(expected)
  })

  it.each([
    [false, [true, true], FilterLogic.And],
    [false, [true, false], FilterLogic.And],
    [true, [false, false], FilterLogic.And],

    [false, [true, true], FilterLogic.Or],
    [true, [true, false], FilterLogic.Or],
    [true, [false, false], FilterLogic.Or],
  ])('exclude=true', async (expected, values, logic) => {
    values.forEach((value) => handle.mockReturnValueOnce(value))

    const result = await service.checkFilters(
      {
        logic,
        items: values.map(() => filterObject(true)),
      },
      'stream-id',
    )

    expect(result).toEqual(expected)
  })
})
