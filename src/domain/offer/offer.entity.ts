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
import { AffiliateNetwork } from '@/domain/affiliate-network/affiliate-network.entity'
import { User } from '@/domain/user/user.entity'

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  declare id: string

  @Column({ type: 'text', nullable: false })
  declare name: string

  @Column({ type: 'text', nullable: false })
  declare url: string

  @ManyToOne(() => AffiliateNetwork, (network) => network.id, {
    nullable: true,
  })
  affiliateNetwork?: AffiliateNetwork

  @Column({ nullable: true })
  affiliateNetworkId?: string

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
