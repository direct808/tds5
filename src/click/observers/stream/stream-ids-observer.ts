import { Injectable } from '@nestjs/common'
import { ClickObserver } from '@/click/observers/subject'
import { Stream } from '@/campaign/entity/stream.entity'
import { ClickContextService } from '@/click/shared/click-context.service'

@Injectable()
export class StreamIdsObserver implements ClickObserver<Stream> {
  constructor(private readonly clickContext: ClickContextService) {}

  public async handle(stream: Stream) {
    const clickData = this.clickContext.getClickData()

    clickData.campaignId = stream.campaign.id
    clickData.streamId = stream.id
    clickData.trafficSourceId = stream.campaign.sourceId
  }
}
