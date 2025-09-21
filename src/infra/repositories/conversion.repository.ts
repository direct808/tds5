import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Conversion } from '@/domain/conversion/conversion.entity'

@Injectable()
export class ConversionRepository {
  private readonly repository = this.dataSource.getRepository(Conversion)

  constructor(private readonly dataSource: DataSource) {}

  public getList(): Promise<Conversion[]> {
    return this.repository.find()
  }

  public async create(data: Partial<Conversion>): Promise<void> {
    const entity = this.repository.create(data)

    await this.repository.insert(entity)
  }

  public async getByClickId(clickId: string): Promise<Conversion | null> {
    const list = await this.repository.findBy({ clickId })

    return list[0]
  }

  public async update(id: string, data: Partial<Conversion>): Promise<void> {
    await this.repository.update({ id }, data)
  }
}
