import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@/domain/user/user.entity'

@Entity()
export class Source {
  @PrimaryGeneratedColumn('uuid')
  declare id: string

  @Column({ type: 'text', nullable: false })
  declare name: string

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  declare user: User

  @Column()
  @Index()
  declare userId: string

  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date
}
