import { INestApplication } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  ConversionCreatedEvent,
  conversionCreatedEventName,
} from '../../src/domain/conversion/events/conversion-created.event'

export async function waitConversionRegistered(
  app: INestApplication,
): Promise<string> {
  const emitter = app.get(EventEmitter2)

  return new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Wait conversion registered timeout')),
      1000,
    )

    emitter.once(
      conversionCreatedEventName,
      ({ conversionId }: ConversionCreatedEvent) => {
        clearTimeout(timeout)
        resolve(conversionId)
      },
    )
  })
}
