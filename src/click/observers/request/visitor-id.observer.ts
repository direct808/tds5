import { Injectable } from '@nestjs/common'
import { ClickObserver, RequestObserverData } from '@/click/observers/subject'
import { IdGenerator, VISITOR_ID_SIZE } from '@/click/observers/id-generator'

@Injectable()
export class VisitorIdObserver implements ClickObserver<RequestObserverData> {
  constructor(private readonly generator: IdGenerator) {}

  public async handle({ request, clickData }: RequestObserverData) {
    let visitorId: string | undefined = request.cookie('visitorId')
    if (!visitorId || visitorId.length !== VISITOR_ID_SIZE) {
      visitorId = await this.generator.generate(VISITOR_ID_SIZE)
    }

    clickData.visitorId = visitorId
  }
}
