import { Injectable, Logger } from '@nestjs/common'
import { ClickRepository } from '@/click/shared/click.repository'
import { ClickData } from './click-data'

@Injectable()
export class RegisterClickService {
  private readonly logger = new Logger(RegisterClickService.name)
  constructor(private readonly clickRepository: ClickRepository) {}

  public register(clickData: ClickData): void {
    this.clickRepository.add(clickData).catch((e) => this.logger.error(e))
  }
}
