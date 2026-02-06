import type { ActionType } from '../../../../types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NothingActionType implements ActionType {
  handle: ActionType['handle'] = () => {
    return { content: '' }
  }
}
