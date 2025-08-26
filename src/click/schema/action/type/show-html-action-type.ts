import { ActionType, StreamResponse } from '@/click/types'
import { Stream } from '@/campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  handle(stream: Stream): StreamResponse {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
