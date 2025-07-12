import { ActionType, StreamResponse } from '@/click/types.js'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class Show404ActionType implements ActionType {
  async handle(): Promise<StreamResponse> {
    return { status: HttpStatus.NOT_FOUND, content: '' }
  }
}
