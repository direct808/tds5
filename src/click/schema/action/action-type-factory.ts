import { Injectable } from '@nestjs/common'
import { ActionType, StreamResponse } from '../../types'
import { Stream, StreamActionType } from '@/campaign/entity/stream.entity'
import { ModuleRef } from '@nestjs/core'
import {
  NothingActionType,
  Show404ActionType,
  ShowHtmlActionType,
  ShowTextActionType,
  ToCampaignActionType,
} from './type'

@Injectable()
export class ActionTypeFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  handle(stream: Stream): Promise<StreamResponse> {
    if (!stream.actionType) {
      throw new Error('No actionType')
    }
    return this.create(stream.actionType).handle(stream)
  }

  private create(actionType: StreamActionType): ActionType {
    switch (actionType) {
      case StreamActionType.SHOW404:
        return this.moduleRef.get(Show404ActionType)
      case StreamActionType.SHOW_HTML:
        return this.moduleRef.get(ShowHtmlActionType)
      case StreamActionType.SHOW_TEXT:
        return this.moduleRef.get(ShowTextActionType)
      case StreamActionType.NOTHING:
        return this.moduleRef.get(NothingActionType)
      case StreamActionType.TO_CAMPAIGN:
        return this.moduleRef.get(ToCampaignActionType)
    }

    const at: never = actionType
    throw new Error(`Unknown redirectType: "${at}"`)
  }
}
