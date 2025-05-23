import { Injectable } from '@nestjs/common'
import { Stream } from '../campaign/entity/stream.entity'

@Injectable()
export class SelectStreamService {
  async selectStream(streams: Stream[]): Promise<Stream> {
    if (streams.length === 0) {
      throw new Error('No streams')
    }

    return streams[0]
  }
}
