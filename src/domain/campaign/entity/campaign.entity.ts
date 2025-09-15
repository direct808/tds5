import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Stream } from './stream.entity'
import { Source } from '@/domain/source/source.entity'
import { User } from '@/domain/user/user.entity'

@Entity()
export class Campaign {
  @Column('uuid', { generated: 'uuid', primary: true })
  declare id: string

  @Column()
  declare name: string

  @Column()
  @Index({ unique: true })
  declare code: string

  @ManyToOne(() => Source, (source) => source.id, {
    nullable: true,
  })
  source?: Source

  @Column('uuid', { nullable: true })
  declare sourceId?: string

  @OneToMany(() => Stream, (stream) => stream.campaign)
  declare streams: Stream[]

  @Column()
  declare active: boolean

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  declare user: User

  @Column()
  @Index()
  declare userId: string

  @CreateDateColumn()
  declare createdAt: Date

  @UpdateDateColumn()
  declare updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
