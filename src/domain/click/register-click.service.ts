import { Injectable, Logger } from '@nestjs/common'
import { ClickData } from './click-data'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  ClickRegisteredEvent,
  clickRegisteredEventName,
} from '@/domain/click/events/click-registered.event'

@Injectable()
export class RegisterClickService {
  private readonly logger = new Logger(RegisterClickService.name)
  constructor(
    private readonly clickRepository: ClickRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public register(clickData: ClickData): void {
    this.clickRepository
      .add(clickData)
      .then(() =>
        this.eventEmitter.emit(
          clickRegisteredEventName,
          new ClickRegisteredEvent(),
        ),
      )
      .catch((e) => this.logger.error(e))
  }
}
