import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import { Campaign } from './campaign.entity'
import { StreamOffer } from './stream-offer.entity'
import { Filters } from '@/domain/click/stream/stream-filter/types'
import {
  CampaignStreamSchema,
  StreamActionType,
  StreamRedirectType,
} from '@/domain/campaign/types'

@Entity()
export class Stream {
  @Column('uuid', { generated: 'uuid', primary: true })
  declare id: string

  @Column()
  declare name: string

  @ManyToOne(() => Campaign, (campaign) => campaign.streams, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  declare campaign?: Campaign

  @Column()
  @Index()
  declare campaignId: string

  @Column('enum', { nullable: false, enum: CampaignStreamSchema })
  declare schema: CampaignStreamSchema

  @Column('enum', { nullable: true, enum: StreamRedirectType })
  declare redirectType: StreamRedirectType | null

  @Column('text', { nullable: true })
  declare redirectUrl: string | null

  @Column('enum', { nullable: true, enum: StreamActionType })
  declare actionType: StreamActionType | null

  @Column('uuid', { nullable: true })
  declare actionCampaignId: string | null

  @ManyToOne(() => Campaign, (campaign) => campaign.streams, {
    nullable: true,
  })
  declare actionCampaign: Campaign | null

  @Column('text', { nullable: true })
  declare actionContent: string | null

  @OneToMany(() => StreamOffer, (offer) => offer.stream)
  declare streamOffers: StreamOffer[] | null

  @Column('jsonb', { nullable: true })
  declare filters: Filters | null
}
