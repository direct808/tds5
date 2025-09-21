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

  public async create(data: Partial<Conversion>): Promise<string> {
    const entity = this.repository.create(data)

    const res = await this.repository.insert(entity)

    return res.identifiers[0].id
  }

  public async getByClickId(clickId: string): Promise<Conversion | null> {
    const list = await this.repository.findBy({ clickId })

    return list[0]
  }

  public async getById(id: string): Promise<Conversion | null> {
    return this.repository.findOneBy({ id })
  }

  public async update(id: string, data: Partial<Conversion>): Promise<void> {
    await this.repository.update({ id }, data)
  }
}
