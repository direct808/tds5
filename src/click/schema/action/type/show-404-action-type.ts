import { ActionType, StreamResponse } from '@/click/types'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class Show404ActionType implements ActionType {
  handle(): StreamResponse {
    return { status: HttpStatus.NOT_FOUND, content: '' }
  }
}
