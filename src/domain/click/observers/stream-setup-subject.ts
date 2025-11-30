import { ClickSubject } from '@/domain/click/observers/subject'
import { ClickIdObserver } from '@/domain/click/observers/stream/click-id.observer'
import { Injectable } from '@nestjs/common'
import { StreamModel } from '@generated/prisma/models/Stream'

@Injectable()
export class StreamSetupSubject {
  constructor(private readonly clickIdObserver: ClickIdObserver) {}

  public async setup(stream: StreamModel): Promise<void> {
    const streamSubject = new ClickSubject<StreamModel>()

    streamSubject.attach(this.clickIdObserver)

    await streamSubject.notify(stream)
  }
}
