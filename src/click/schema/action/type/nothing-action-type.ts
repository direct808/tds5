import { ActionType, StreamResponse } from '@/click/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NothingActionType implements ActionType {
  handle(): StreamResponse {
    return { content: '' }
  }
}
