import { ClickData } from '@/click/click-data'
import { Stream } from '@/campaign/entity/stream.entity'
import { Injectable } from '@nestjs/common'
import { StreamSetupSubject } from '@/click/observers/stream-setup-subject'
import { RequestSetupSubject } from '@/click/observers/request-setup-subject'
import { ClickContext } from '@/click/types'

@Injectable()
export class SetupSubject {
  constructor(
    private readonly streamSetupSubject: StreamSetupSubject,
    private readonly requestSetupSubject: RequestSetupSubject,
  ) {}

  public async setupRequestSubject(cContext: ClickContext): Promise<void> {
    return this.requestSetupSubject.setup(cContext)
  }

  public async setupStreamSubject(
    clickData: ClickData,
    stream: Stream,
  ): Promise<void> {
    return this.streamSetupSubject.setup(clickData, stream)
  }
}
