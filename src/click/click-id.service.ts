import { Injectable } from '@nestjs/common'
import { customAlphabet } from 'nanoid/async'
import { Request } from 'express'
import { ClickData } from './click-data'

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
const visitorIdSize = 7
const clickIdSize = 7

type SetVisitorIdArgs = {
  request: Request
  clickData: ClickData
}

@Injectable()
export class ClickIdService {
  private readonly generateId = customAlphabet(alphabet)

  public async setVisitorId(args: SetVisitorIdArgs): Promise<void> {
    const { request, clickData } = args
    let visitorId: string | undefined = request.cookies.visitorId
    if (!visitorId || visitorId.length !== visitorIdSize) {
      visitorId = await this.generateId(visitorIdSize)
    }
    clickData.visitorId = visitorId
    clickData.clickId = visitorId + (await this.generateId(clickIdSize))
  }
}
