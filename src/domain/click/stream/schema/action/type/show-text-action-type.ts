import { ActionType, StreamResponse } from '@/domain/click/types'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowTextActionType implements ActionType {
  handle(stream: Stream): StreamResponse {
    return {
      content: this.#escape(stream.actionContent ?? ''),
    }
  }

  #escape(unsafe: string): string {
    return unsafe
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
}
