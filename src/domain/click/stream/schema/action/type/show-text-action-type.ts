import { ActionType, StreamResponse } from '@/domain/click/types'
import { Injectable } from '@nestjs/common'
import { StreamModel } from '@generated/prisma/models/Stream'

@Injectable()
export class ShowTextActionType implements ActionType {
  handle(stream: StreamModel): StreamResponse {
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
