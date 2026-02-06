import { Injectable } from '@nestjs/common'
import { RedirectTypeFactory } from './redirect-type-factory'
import { StreamDirectUrl } from '../../../../campaign/types'
import { MaybePromise } from '../../../../../shared/types'
import { StreamResponse } from '../../../types'

@Injectable()
export class DirectUrlService {
  constructor(private redirectTypeFactory: RedirectTypeFactory) {}

  handle(stream: StreamDirectUrl): MaybePromise<StreamResponse> {
    return this.redirectTypeFactory.handle(stream)
  }
}
