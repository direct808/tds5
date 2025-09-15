import { ActionType, StreamResponse } from '@/domain/click/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NothingActionType implements ActionType {
  handle(): StreamResponse {
    return { content: '' }
  }
}
