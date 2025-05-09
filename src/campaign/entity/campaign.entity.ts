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
import { User } from '../../user'
import { Source } from '../../source'
import { Stream } from './stream.entity'

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
  user: User

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
