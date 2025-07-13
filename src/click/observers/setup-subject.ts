import { Stream } from '../../campaign/entity/stream.entity.js'
import { Injectable } from '@nestjs/common'
import { StreamSetupSubject } from './stream-setup-subject.js'
import { RequestSetupSubject } from './request-setup-subject.js'

@Injectable()
export class SetupSubject {
  constructor(
    private readonly streamSetupSubject: StreamSetupSubject,
    private readonly requestSetupSubject: RequestSetupSubject,
  ) {}

  public async setupRequestSubject(): Promise<void> {
    return this.requestSetupSubject.setup()
  }

  public async setupStreamSubject(stream: Stream): Promise<void> {
    return this.streamSetupSubject.setup(stream)
  }
}
