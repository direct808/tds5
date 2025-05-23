import { ActionType } from '../../../types'
import { Stream } from '../../../../campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShowHtmlActionType implements ActionType {
  async handle(stream: Stream) {
    return {
      content: stream.actionContent ?? '',
    }
  }
}
