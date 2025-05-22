import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Campaign } from './campaign.entity'
import { StreamOffer } from './stream-offer.entity'

export enum CampaignStreamSchema {
  ACTION = 'ACTION',
  DIRECT_URL = 'DIRECT_URL',
  LANDINGS_OFFERS = 'LANDINGS_OFFERS',
}

export enum StreamRedirectType {
  CURL = 'CURL',
  FORM_SUBMIT = 'FORM_SUBMIT',
  HTTP = 'HTTP',
  IFRAME = 'IFRAME',
  JS = 'JS',
  META = 'META',
  META2 = 'META2',
  REMOTE = 'REMOTE',
  WITHOUT_REFERER = 'WITHOUT_REFERER',
}

export enum StreamActionType {
  NOTHING = 'NOTHING',
  SHOW404 = 'SHOW404',
  SHOW_HTML = 'SHOW_HTML',
  SHOW_TEXT = 'SHOW_TEXT',
  TO_CAMPAIGN = 'TO_CAMPAIGN',
}

export interface StreamDirectUrl extends Stream {
  redirectType: StreamRedirectType
  redirectUrl: string
}

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
  declare campaign: Campaign

  @Column()
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
}
