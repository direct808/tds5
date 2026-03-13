import type { ActionType } from '@/domain/click/types'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class Show404ActionType implements ActionType {
  handle: ActionType['handle'] = () => {
    return { status: HttpStatus.NOT_FOUND, content: '' }
  }
}
