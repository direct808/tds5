import { Injectable } from '@nestjs/common'
import {
  CLICK_ID_SIZE,
  IdGenerator,
  VISITOR_ID_SIZE,
} from '@/domain/click/observers/id-generator'
import { ClickObserver } from '@/domain/click/observers/subject'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { ClickContext } from '@/domain/click/shared/click-context.service'

const SIZE = CLICK_ID_SIZE - VISITOR_ID_SIZE

@Injectable()
export class ClickIdObserver implements ClickObserver<Stream> {
  constructor(
    private readonly generator: IdGenerator,
    private readonly clickContext: ClickContext,
  ) {}

  public async handle(): Promise<void> {
    const clickData = this.clickContext.getClickData()

    if (!clickData.visitorId) {
      throw new Error('No visitorId')
    }
    const id = await this.generator.generate(SIZE)
    clickData.id = clickData.visitorId + id
  }
}
