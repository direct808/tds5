import { ActionType } from '../../../types'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class Show404ActionType implements ActionType {
  async handle() {
    return { statusCode: HttpStatus.NOT_FOUND, content: '' }
  }
}
