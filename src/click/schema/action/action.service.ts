import { ActionTypeFactory } from './action-type-factory.js'
import { Stream } from '@/campaign/entity/stream.entity.js'
import { StreamResponse } from '../../types.js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ActionService {
  constructor(private actionTypeFactory: ActionTypeFactory) {}

  public handle(stream: Stream): Promise<StreamResponse> {
    return this.actionTypeFactory.handle(stream)
  }
}
