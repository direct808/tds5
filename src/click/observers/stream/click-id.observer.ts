import { Injectable } from '@nestjs/common'
import {
  CLICK_ID_SIZE,
  IdGenerator,
  VISITOR_ID_SIZE,
} from '@/click/observers/id-generator'
import { ClickObserver, StreamObserverData } from '@/click/observers/subject'

const SIZE = CLICK_ID_SIZE - VISITOR_ID_SIZE

@Injectable()
export class ClickIdObserver implements ClickObserver<StreamObserverData> {
  constructor(private readonly generator: IdGenerator) {}

  public async handle({ clickData }: StreamObserverData) {
    if (!clickData.visitorId) {
      throw new Error('No visitorId')
    }
    const id = await this.generator.generate(SIZE)
    clickData.id = clickData.visitorId + id
  }
}
