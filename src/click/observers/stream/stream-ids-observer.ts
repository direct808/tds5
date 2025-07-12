import { Injectable } from '@nestjs/common'
import { ClickObserver } from '@/click/observers/subject.js'
import { Stream } from '@/campaign/entity/stream.entity.js'
import { ClickContext } from '@/click/shared/click-context.service.js'

@Injectable()
export class StreamIdsObserver implements ClickObserver<Stream> {
  constructor(private readonly clickContext: ClickContext) {}

  public async handle(stream: Stream) {
    const clickData = this.clickContext.getClickData()

    clickData.campaignId = stream.campaign.id
    clickData.streamId = stream.id
    clickData.trafficSourceId = stream.campaign.sourceId
  }
}
