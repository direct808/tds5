import { Injectable } from '@nestjs/common'
import { ClickObserver, StreamObserverData } from '@/click/observers/subject'

@Injectable()
export class StreamIdsObserver implements ClickObserver<StreamObserverData> {
  public async handle({ stream, clickData }: StreamObserverData) {
    clickData.campaignId = stream.campaign.id
    clickData.streamId = stream.id
    clickData.trafficSourceId = stream.campaign.sourceId
  }
}
