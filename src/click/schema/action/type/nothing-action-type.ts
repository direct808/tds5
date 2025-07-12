import { ActionType, StreamResponse } from '@/click/types.js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NothingActionType implements ActionType {
  async handle(): Promise<StreamResponse> {
    return { content: '' }
  }
}
