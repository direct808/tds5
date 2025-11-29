import { ActionTypeFactory } from './action-type-factory'
import { StreamResponse } from '../../../types'
import { Injectable } from '@nestjs/common'
import { MaybePromise } from '@/shared/types'
import { StreamModel } from '../../../../../../generated/prisma/models/Stream'

@Injectable()
export class ActionService {
  constructor(private actionTypeFactory: ActionTypeFactory) {}

  public handle(stream: StreamModel): MaybePromise<StreamResponse> {
    return this.actionTypeFactory.handle(stream)
  }
}
