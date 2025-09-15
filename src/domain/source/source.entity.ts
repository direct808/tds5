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

  @CreateDateColumn()
  declare createdAt: Date

  @UpdateDateColumn()
  declare updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
