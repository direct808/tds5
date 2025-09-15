import { ActionType, StreamResponse } from '@/domain/click/types'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  handle(stream: Stream): StreamResponse {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
