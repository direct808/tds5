import { ClickSubject } from '@/domain/click/observers/subject'
// import { StreamIdsObserver } from '@/click/observers/stream/stream-ids-observer'
import { ClickIdObserver } from '@/domain/click/observers/stream/click-id.observer'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StreamSetupSubject {
  constructor(private readonly clickIdObserver: ClickIdObserver) {}

  public async setup(stream: Stream) {
    const streamSubject = new ClickSubject<Stream>()

    streamSubject.attach(this.clickIdObserver)

    await streamSubject.notify(stream)
  }
}
