import { customAlphabet } from 'nanoid/async'
import { Injectable } from '@nestjs/common'

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
export const VISITOR_ID_SIZE = 6
export const CLICK_ID_SIZE = 12

@Injectable()
export class IdGenerator {
  public readonly generateId = customAlphabet(alphabet)

  public generate(size: number): Promise<string> {
    // todo
    // @ts-ignore
    return this.generateId(size)
  }
}
