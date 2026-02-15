import { Injectable } from '@nestjs/common'
import { ClickObserver } from '../subject'
import { IdGenerator, VISITOR_ID_SIZE } from '../id-generator'
import { ClickContext } from '../../shared/click-context.service'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class VisitorIdObserver implements ClickObserver {
  constructor(
    private readonly generator: IdGenerator,
    private readonly clickContext: ClickContext,
  ) {}

  public async handle(): Promise<void> {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    let visitorId: string | undefined = request.cookie('visitorId')
    if (isNullable(visitorId) || visitorId.length !== VISITOR_ID_SIZE) {
      visitorId = await this.generator.generate(VISITOR_ID_SIZE)
    }

    clickData.visitorId = visitorId
  }
}
