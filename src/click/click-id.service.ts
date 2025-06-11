import { Injectable } from '@nestjs/common'
import { customAlphabet } from 'nanoid/async'
import { Request } from 'express'

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
export const VISITOR_ID_SIZE = 6
export const CLICK_ID_SIZE = 12

@Injectable()
export class ClickIdService {
  private readonly generateId = customAlphabet(alphabet)

  public async getVisitorIds(request: Request): Promise<string> {
    let visitorId: string | undefined = request.cookies.visitorId
    if (!visitorId || visitorId.length !== VISITOR_ID_SIZE) {
      visitorId = await this.generateId(VISITOR_ID_SIZE)
    }

    return visitorId
  }

  async getClickId(visitorId?: string): Promise<string> {
    if (!visitorId) {
      throw new Error('No visitorId')
    }
    return visitorId + (await this.generateId(CLICK_ID_SIZE - VISITOR_ID_SIZE))
  }
}
