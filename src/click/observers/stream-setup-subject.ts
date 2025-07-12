import { ClickSubject } from '@/click/observers/subject.js'
import { StreamIdsObserver } from '@/click/observers/stream/stream-ids-observer.js'
import { ClickIdObserver } from '@/click/observers/stream/click-id.observer.js'
import { Stream } from '@/campaign/entity/stream.entity.js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StreamSetupSubject {
  constructor(
    private readonly streamIdsObserver: StreamIdsObserver,
    private readonly clickIdObserver: ClickIdObserver,
  ) {}

  public async setup(stream: Stream) {
    const streamSubject = new ClickSubject<Stream>()

    streamSubject.attach(this.streamIdsObserver)
    streamSubject.attach(this.clickIdObserver)

    await streamSubject.notify(stream)
  }
}
