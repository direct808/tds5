import { Injectable } from '@nestjs/common'
import { RedirectTypeFactory } from './redirect-type-factory'
import { StreamDirectUrl } from '@/domain/campaign/types'

@Injectable()
export class DirectUrlService {
  constructor(private redirectTypeFactory: RedirectTypeFactory) {}

  handle(stream: StreamDirectUrl) {
    return this.redirectTypeFactory.handle(stream)
  }
}
