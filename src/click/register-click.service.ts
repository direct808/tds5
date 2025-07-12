import { Injectable } from '@nestjs/common'
import { ClickRepository } from './click.repository.js'
import { ClickData } from './click-data.js'

@Injectable()
export class RegisterClickService {
  constructor(private readonly clickRepository: ClickRepository) {}

  public async register(clickData: ClickData): Promise<void> {
    await this.clickRepository.add(clickData)
  }
}
