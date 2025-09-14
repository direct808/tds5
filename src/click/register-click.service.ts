import { Injectable, Logger } from '@nestjs/common'
import { ClickData } from './click-data'
import { ClickRepository } from '@/infra/repositories/click.repository'

@Injectable()
export class RegisterClickService {
  private readonly logger = new Logger(RegisterClickService.name)
  constructor(private readonly clickRepository: ClickRepository) {}

  public register(clickData: ClickData): void {
    this.clickRepository.add(clickData).catch((e) => this.logger.error(e))
  }
}
