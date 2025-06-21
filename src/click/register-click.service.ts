import { Injectable } from '@nestjs/common'
import { ClickRepository } from './click.repository'
import { ClickData } from './click-data'

@Injectable()
export class RegisterClickService {
  constructor(private readonly clickRepository: ClickRepository) {}

  public async register(clickData: ClickData): Promise<void> {
    await this.clickRepository.add(clickData)
  }
}
