import { ActionType, StreamResponse } from '../../../types.js'
import { Stream } from '../../../../campaign/entity/stream.entity.js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  async handle(stream: Stream): Promise<StreamResponse> {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
