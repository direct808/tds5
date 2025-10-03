import { Column, CreateDateColumn, Entity, Index, ManyToOne } from 'typeorm'
import { Click } from '@/domain/click/click.entity'
import { CLICK_ID_SIZE } from '@/domain/click/observers/id-generator'

export enum ConversionStatus {
  sale = 'sale',
  rejected = 'rejected',
  lead = 'lead',
}

@Entity()
export class Conversion {
  @Column('uuid', { generated: 'uuid', primary: true })
  declare id: string

  @Column('char', { length: CLICK_ID_SIZE })
  @Index({ unique: false })
  declare clickId: string

  @ManyToOne(() => Click, (click) => click.id)
  declare click: Click

  @Column('text')
  declare status: string

  @Column('numeric', { nullable: true, precision: 12, scale: 2 })
  declare revenue?: number

  @Column('text', { nullable: true })
  declare previousStatus?: string

  @Column('text', { nullable: true })
  declare originalStatus?: string

  @Column('jsonb', { nullable: true })
  declare params?: object

  @CreateDateColumn()
  declare createdAt: Date
}
