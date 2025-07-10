import { Injectable } from '@nestjs/common'
import { ClickObserver } from '@/click/observers/subject'
import { IdGenerator } from '@/click/observers/id-generator'
import { ClickContextService } from '@/click/click-context.service'
import { Stream } from '@/campaign/entity/stream.entity'

@Injectable()
export class StreamIdsObserver implements ClickObserver<Stream> {
  constructor(
    private readonly generator: IdGenerator,
    private readonly clickContext: ClickContextService,
  ) {}

  public async handle(stream: Stream) {
    const clickData = this.clickContext.getClickData()

    clickData.campaignId = stream.campaign.id
    clickData.streamId = stream.id
    clickData.trafficSourceId = stream.campaign.sourceId
  }
}
