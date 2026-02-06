import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '../../../types'
import { ModuleRef } from '@nestjs/core'
import {
  NothingActionType,
  Show404ActionType,
  ShowHtmlActionType,
  ShowTextActionType,
  ToCampaignActionType,
} from './type'
import { MaybePromise } from '../../../../../shared/types'
import { StreamFull } from '../../../../campaign/types'
import { StreamActionTypeEnum } from '@generated/prisma/enums'

@Injectable()
export class ActionTypeFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  handle(stream: StreamFull): MaybePromise<StreamResponse> {
    if (!stream.actionType) {
      throw new Error('No actionType')
    }

    return this.create(stream.actionType).handle(stream)
  }

  private create(actionType: StreamActionTypeEnum): ActionType {
    switch (actionType) {
      case StreamActionTypeEnum.SHOW404:
        return this.moduleRef.get(Show404ActionType)
      case StreamActionTypeEnum.SHOW_HTML:
        return this.moduleRef.get(ShowHtmlActionType)
      case StreamActionTypeEnum.SHOW_TEXT:
        return this.moduleRef.get(ShowTextActionType)
      case StreamActionTypeEnum.NOTHING:
        return this.moduleRef.get(NothingActionType)
      case StreamActionTypeEnum.TO_CAMPAIGN:
        return this.moduleRef.get(ToCampaignActionType)
    }

    const at: never = actionType
    throw new Error(`Unknown redirectType: "${at}"`)
  }
}
