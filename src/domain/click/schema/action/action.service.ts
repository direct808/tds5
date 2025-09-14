import { ActionTypeFactory } from './action-type-factory'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { StreamResponse } from '../../types'
import { Injectable } from '@nestjs/common'
import { MaybePromise } from '@/shared/types'

@Injectable()
export class ActionService {
  constructor(private actionTypeFactory: ActionTypeFactory) {}

  public handle(stream: Stream): MaybePromise<StreamResponse> {
    return this.actionTypeFactory.handle(stream)
  }
}
