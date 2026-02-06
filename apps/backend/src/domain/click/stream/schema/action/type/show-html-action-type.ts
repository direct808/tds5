import { ActionType } from '../../../../types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  handle: ActionType['handle'] = (stream) => {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
