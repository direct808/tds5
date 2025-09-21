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
  @Index({ unique: true })
  declare clickId: string

  @ManyToOne(() => Click, (click) => click.id)
  declare click: Click

  @Column('enum', { enum: ConversionStatus })
  declare status: ConversionStatus

  @Column('enum', { enum: ConversionStatus, nullable: true })
  declare previousStatus: ConversionStatus

  @Column('text', { nullable: true })
  declare originalStatus?: string

  @Column('jsonb', { nullable: true })
  declare params?: object

  @CreateDateColumn()
  declare createdAt: Date
}
