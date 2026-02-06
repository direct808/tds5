import { ConversionType, conversionTypes } from './types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConversionTypeIterator {
  public *get(): Generator<{ type: string; conversionType: ConversionType }> {
    for (const [type, conversionType] of Object.entries(conversionTypes)) {
      yield { type, conversionType }
    }
  }
}
