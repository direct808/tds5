import { Injectable } from '@nestjs/common'
import { CLICK_ID_SIZE, IdGenerator, VISITOR_ID_SIZE } from '../id-generator'
import { ClickObserver } from '../subject'
import { ClickContext } from '../../shared/click-context.service'
import { StreamModel } from '@generated/prisma/models/Stream'

const SIZE = CLICK_ID_SIZE - VISITOR_ID_SIZE

@Injectable()
export class ClickIdObserver implements ClickObserver<StreamModel> {
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
