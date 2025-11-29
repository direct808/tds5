import { ActionType, StreamResponse } from '@/domain/click/types'
import { Injectable } from '@nestjs/common'
import { StreamModel } from '../../../../../../../generated/prisma/models/Stream'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  handle(stream: StreamModel): StreamResponse {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
