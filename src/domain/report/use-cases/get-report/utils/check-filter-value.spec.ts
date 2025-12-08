import { checkFilterValue } from '@/domain/report/use-cases/get-report/utils/check-filter-value'
import {
  FilterOperatorEnum as Op,
  FilterTypeEnum as Type,
} from '@/domain/report/types'
import { BadRequestException } from '@nestjs/common'

describe('checkFilterValue', () => {
  it.each([
    [Type.string, 'StrValue', true],
    [Type.string, 1, false],
    [Type.string, ['StrValue'], false],
    [Type.string, true, false],

    [Type.ip, '192.168.1.2', true],
    [Type.ip, 1, false],
    [Type.ip, 'StrValue', false],
    [Type.ip, ['StrValue'], false],
    [Type.ip, true, false],

    [Type.number, 1, true],
    [Type.number, '1', false],
    [Type.number, [1], false],
    [Type.number, true, false],

    [Type.boolean, true, true],
    [Type.boolean, [true], false],
    [Type.boolean, 'asd', false],
    [Type.boolean, 1, false],
  ])(`Check scalar %s for %s`, (type, value, success) => {
    const fn = () => checkFilterValue(Op['='], 'field', type, value)

    if (success) {
      fn()
    } else {
      expect(() => fn()).toThrow(BadRequestException)
    }
  })

  it.each([
    [Type.string, ['StrValue'], true],
    [Type.string, [1], false],
    [Type.string, 'StrValue', false],
    [Type.string, [true], false],

    [Type.ip, ['192.168.1.2'], true],
    [Type.ip, [1], false],
    [Type.ip, 'StrValue', false],
    [Type.ip, ['StrValue'], false],
    [Type.ip, [true], false],

    [Type.number, [1], true],
    [Type.number, '1', false],
    [Type.number, 1, false],
    [Type.number, [true], false],

    [Type.boolean, [true], true],
    [Type.boolean, true, false],
    [Type.boolean, ['asd'], false],
    [Type.boolean, [1], false],
  ])(`Check array %s for %s`, (type, value, success) => {
    const fn = () => checkFilterValue(Op.in, 'field', type, value)

    if (success) {
      fn()
    } else {
      expect(() => fn()).toThrow(BadRequestException)
    }
  })

  it.each([
    [Type.number, [1, 2], true],
    [Type.string, [1, 2], false],
    [Type.number, [2, 1], false],
    [Type.number, ['StrValue', 1], false],
    [Type.number, ['StrValue', 'StrValue'], false],
    [Type.number, [1], false],
    [Type.number, 'StrValue', false],
    [Type.number, [true], false],
  ])(`Check between %s for %s`, (type, value, success) => {
    const fn = () => checkFilterValue(Op.between, 'field', type, value)

    if (success) {
      fn()
    } else {
      expect(() => fn()).toThrow(BadRequestException)
    }
  })

  it('Error if unknown type', () => {
    const fn = () => checkFilterValue(Op['='], 'field', 'hz' as Type, 1)
    expect(() => fn()).toThrow("Unknown filter type '${filterType}'")
  })
})
