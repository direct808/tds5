import type { ActionType } from '../../../../types'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class Show404ActionType implements ActionType {
  handle: ActionType['handle'] = () => {
    return { status: HttpStatus.NOT_FOUND, content: '' }
  }
}
