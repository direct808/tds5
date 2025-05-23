import { ActionTypeFactory } from './action-type-factory'
import { Stream } from '../../../campaign/entity/stream.entity'
import { ClickContext, StreamResponse } from '../../types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ActionService {
  constructor(private actionTypeFactory: ActionTypeFactory) {}

  public handle(
    stream: Stream,
    clickContext: ClickContext,
  ): Promise<StreamResponse> {
    return this.actionTypeFactory.handle(stream, clickContext)
  }
}
