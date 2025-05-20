import { ActionType, StreamResponse } from '../../../types'

export class NothingActionType implements ActionType {
  async handle(): Promise<StreamResponse> {
    return { content: '' }
  }
}
