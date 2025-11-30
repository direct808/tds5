import { Injectable } from '@nestjs/common'
import { StreamSetupSubject } from '@/domain/click/observers/stream-setup-subject'
import { RequestSetupSubject } from '@/domain/click/observers/request-setup-subject'
import { StreamModel } from '@generated/prisma/models/Stream'

@Injectable()
export class SetupSubject {
  constructor(
    private readonly streamSetupSubject: StreamSetupSubject,
    private readonly requestSetupSubject: RequestSetupSubject,
  ) {}

  public async setupRequestSubject(): Promise<void> {
    return this.requestSetupSubject.setup()
  }

  public async setupStreamSubject(stream: StreamModel): Promise<void> {
    return this.streamSetupSubject.setup(stream)
  }
}
