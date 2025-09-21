import { Injectable, Logger } from '@nestjs/common'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import {
  Conversion,
  ConversionStatus,
} from '@/domain/conversion/conversion.entity'
import { RequestAdapter } from '@/shared/request-adapter'
import { ConversionStatusService } from '@/domain/conversion/conversion-status.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  ConversionCreatedEvent,
  conversionCreatedEventName,
} from '@/domain/conversion/events/conversion-created.event'

@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name)
  constructor(
    private readonly clickRepository: ClickRepository,
    private readonly conversionRepository: ConversionRepository,
    private readonly conversionStatusService: ConversionStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(requestAdapter: RequestAdapter): Promise<void> {
    const clickId = requestAdapter.query('subid')

    if (!clickId) {
      return
    }

    const click = await this.clickRepository.getById(clickId)
    if (!click) {
      this.logger.debug('Unknown clickId', { clickId })

      return
    }

    const existsConversion =
      await this.conversionRepository.getByClickId(clickId)

    const originalStatus = requestAdapter.query('status')
    const status = this.conversionStatusService.getStatus(requestAdapter)

    const data: Partial<Conversion> = {
      status: status as ConversionStatus,
      clickId: click.id,
      originalStatus,
      params: requestAdapter.queryObject(),
    }

    if (existsConversion) {
      data.previousStatus = existsConversion.status

      await this.update(existsConversion, data)
    } else {
      await this.create(data)
    }
  }

  private async create(data: Partial<Conversion>): Promise<void> {
    const id = await this.conversionRepository.create(data)

    this.eventEmitter.emit(
      conversionCreatedEventName,
      new ConversionCreatedEvent(id),
    )
  }

  private async update(
    existsConversion: Conversion,
    data: Partial<Conversion>,
  ): Promise<void> {
    await this.conversionRepository.update(existsConversion.id, data)

    this.eventEmitter.emit(
      conversionCreatedEventName,
      new ConversionCreatedEvent(existsConversion.id),
    )
  }
}
