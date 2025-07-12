import { Injectable } from '@nestjs/common'
import { ClickObserver } from '@/click/observers/subject.js'
import { IdGenerator, VISITOR_ID_SIZE } from '@/click/observers/id-generator.js'
import { ClickContext } from '@/click/shared/click-context.service.js'

@Injectable()
export class VisitorIdObserver implements ClickObserver {
  constructor(
    private readonly generator: IdGenerator,
    private readonly clickContext: ClickContext,
  ) {}

  public async handle() {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    let visitorId: string | undefined = request.cookie('visitorId')
    if (!visitorId || visitorId.length !== VISITOR_ID_SIZE) {
      visitorId = await this.generator.generate(VISITOR_ID_SIZE)
    }

    clickData.visitorId = visitorId
  }
}
