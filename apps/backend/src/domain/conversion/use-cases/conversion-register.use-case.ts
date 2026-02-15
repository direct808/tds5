import { Injectable, Logger } from '@nestjs/common'
import { RequestAdapter } from '@/shared/request-adapter'
import { ConversionUncheckedCreateInput } from '@generated/prisma/models/Conversion'
import {
  ConversionCreatedEvent,
  conversionCreatedEventName,
} from '../events/conversion-created.event'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ConversionTypeService } from '../conversion-type.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ClickModel } from '@generated/prisma/models/Click'
import { isNullable } from '@/shared/helpers'

type GetDataResult = {
  clickId: string
  type: string
  click: ClickModel
  originalStatus: string
  tid: string | undefined
}

@Injectable()
export class ConversionRegisterUseCase {
  private readonly logger = new Logger(ConversionRegisterUseCase.name)
  constructor(
    private readonly clickRepository: ClickRepository,
    private readonly conversionRepository: ConversionRepository,
    private readonly conversionTypeService: ConversionTypeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(requestAdapter: RequestAdapter): Promise<void> {
    const d = await this.getData(requestAdapter)
    if (!d) {
      return
    }

    const { clickId, type, click, originalStatus, tid } = d

    const data: ConversionUncheckedCreateInput = {
      status: type,
      clickId: click.id,
      originalStatus,
      tid,
      revenue: requestAdapter.query('revenue'),
      params: requestAdapter.queryObject(),
    }

    const existsConversion = await this.conversionRepository.getByClickIdAndTid(
      clickId,
      tid,
    )

    if (!isNullable(existsConversion)) {
      data.previousStatus = existsConversion.status

      await this.conversionRepository.update(existsConversion.id, data)
      this.emitConversionCreate(existsConversion.id)
    } else {
      const id = await this.conversionRepository.create(data)
      this.emitConversionCreate(id)
    }
  }

  private async getData(
    requestAdapter: RequestAdapter,
  ): Promise<GetDataResult | undefined> {
    const clickId = requestAdapter.query('subid')
    const originalStatus = requestAdapter.query('status')
    const tid = requestAdapter.query('tid')

    if (isNullable(originalStatus) || isNullable(clickId)) {
      return
    }

    if (!isNullable(tid) && tid.length > 50) {
      this.logger.debug('tid too long')

      return
    }

    const click = await this.clickRepository.getById(clickId)
    if (isNullable(click)) {
      this.logger.debug(`Unknown clickId ${clickId}`)

      return
    }

    const type = this.conversionTypeService.getType(
      originalStatus,
      requestAdapter,
    )

    if (isNullable(type)) {
      this.logger.warn('Unknown conversion type')

      return
    }

    return { clickId, type, click, originalStatus, tid }
  }

  private emitConversionCreate(conversionId: string): void {
    this.eventEmitter.emit(
      conversionCreatedEventName,
      new ConversionCreatedEvent(conversionId),
    )
  }
}
