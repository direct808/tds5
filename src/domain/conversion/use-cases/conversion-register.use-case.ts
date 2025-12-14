import { Injectable, Logger } from '@nestjs/common'
import { RequestAdapter } from '@/shared/request-adapter'
import {
  ConversionModel,
  ConversionUncheckedCreateInput,
  ConversionUncheckedUpdateInput,
} from '@generated/prisma/models/Conversion'
import {
  ConversionCreatedEvent,
  conversionCreatedEventName,
} from '@/domain/conversion/events/conversion-created.event'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ConversionTypeService } from '@/domain/conversion/conversion-type.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ConversionRegisterUseCase {
  private readonly logger = new Logger(ConversionRegisterUseCase.name)
  constructor(
    private readonly clickRepository: ClickRepository,
    private readonly conversionRepository: ConversionRepository,
    private readonly conversionTypeService: ConversionTypeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(requestAdapter: RequestAdapter): Promise<void> {
    const clickId = requestAdapter.query('subid')
    const originalStatus = requestAdapter.query('status')

    if (!originalStatus || !clickId) {
      return
    }

    const click = await this.clickRepository.getById(clickId)
    if (!click) {
      this.logger.debug('Unknown clickId', { clickId })

      return
    }

    const existsConversion =
      await this.conversionRepository.getByClickId(clickId)

    const type = this.conversionTypeService.getType(
      originalStatus,
      requestAdapter,
    )

    if (!type) {
      this.logger.warn('Unknown conversion type')

      return
    }

    const data: ConversionUncheckedCreateInput = {
      status: type,
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

  private async create(data: ConversionUncheckedCreateInput): Promise<void> {
    const id = await this.conversionRepository.create(data)
    this.emitConversionCreate(id)
  }

  private async update(
    existsConversion: ConversionModel,
    data: ConversionUncheckedUpdateInput,
  ): Promise<void> {
    await this.conversionRepository.update(existsConversion.id, data)
    this.emitConversionCreate(existsConversion.id)
  }

  private emitConversionCreate(conversionId: string): void {
    this.eventEmitter.emit(
      conversionCreatedEventName,
      new ConversionCreatedEvent(conversionId),
    )
  }
}
