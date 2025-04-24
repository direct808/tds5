import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../user'
import { AffiliateNetwork } from '../affiliate-network'

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'text', nullable: false })
  url: string

  @ManyToOne(() => AffiliateNetwork, (network) => network.id, {
    nullable: true,
  })
  affiliateNetwork?: AffiliateNetwork

  @Column({ nullable: true })
  affiliateNetworkId?: string

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
