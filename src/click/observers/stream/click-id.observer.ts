import { Injectable } from '@nestjs/common'
import { CLICK_ID_SIZE, IdGenerator, VISITOR_ID_SIZE } from '../id-generator.js'
import { ClickObserver } from '../subject.js'
import { Stream } from '../../../campaign/entity/stream.entity.js'
import { ClickContext } from '../../shared/click-context.service.js'

const SIZE = CLICK_ID_SIZE - VISITOR_ID_SIZE

@Injectable()
export class ClickIdObserver implements ClickObserver<Stream> {
  constructor(
    private readonly generator: IdGenerator,
    private readonly clickContext: ClickContext,
  ) {}

  public async handle() {
    const clickData = this.clickContext.getClickData()

    if (!clickData.visitorId) {
      throw new Error('No visitorId')
    }
    const id = await this.generator.generate(SIZE)
    clickData.id = clickData.visitorId + id
  }
}
