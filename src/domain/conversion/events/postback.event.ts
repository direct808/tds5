import type { RequestAdapter } from '@/shared/request-adapter'

export const postbackEventName = 'postback'

export class PostbackEvent {
  constructor(public readonly requestAdapter: RequestAdapter) {}
}
