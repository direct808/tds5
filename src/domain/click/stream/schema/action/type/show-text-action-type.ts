import { ActionType } from '@/domain/click/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowTextActionType implements ActionType {
  handle: ActionType['handle'] = (stream) => {
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
