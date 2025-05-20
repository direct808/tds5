import { ActionType } from '../../../types'
import { HttpStatus } from '@nestjs/common'

export class Show404ActionType implements ActionType {
  async handle() {
    return { statusCode: HttpStatus.NOT_FOUND, content: '' }
  }
}
