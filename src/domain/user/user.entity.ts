import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  declare id: string

  @Column({ type: 'text', nullable: false, unique: true })
  declare email: string

  @Column({ type: 'text', nullable: false })
  declare password: string

  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date
}
