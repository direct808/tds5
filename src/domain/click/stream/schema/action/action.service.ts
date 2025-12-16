import { ActionTypeFactory } from './action-type-factory'
import { StreamResponse } from '../../../types'
import { Injectable } from '@nestjs/common'
import { MaybePromise } from '@/shared/types'
import { StreamFull } from '@/domain/campaign/types'

@Injectable()
export class ActionService {
  constructor(private actionTypeFactory: ActionTypeFactory) {}

  public handle(stream: StreamFull): MaybePromise<StreamResponse> {
    return this.actionTypeFactory.handle(stream)
  }
}
