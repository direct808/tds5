import { Module } from '@nestjs/common'
import { ActionService } from './action.service'
import { ActionTypeFactory } from './action-type-factory'
import {
  NothingActionType,
  Show404ActionType,
  ShowHtmlActionType,
  ShowTextActionType,
  ToCampaignActionType,
} from './type'
import { ClickSharedModule } from '../../../shared/click-shared.module'

@Module({
  imports: [ClickSharedModule],
  providers: [
    ActionService,
    ActionTypeFactory,
    NothingActionType,
    Show404ActionType,
    ShowHtmlActionType,
    ShowTextActionType,
    ToCampaignActionType,
  ],
  exports: [ActionService],
})
export class ActionModule {}
