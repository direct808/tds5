import { Column, CreateDateColumn, Entity } from 'typeorm'
import {
  CLICK_ID_SIZE,
  VISITOR_ID_SIZE,
} from '@/domain/click/observers/id-generator'
import { IClick } from './click'
import { Nullable } from '@/shared/types'

const ColumnTextNullable = () => Column('text', { nullable: true })

@Entity()
export class Click implements Nullable<IClick> {
  @Column('char', { length: CLICK_ID_SIZE, primary: true })
  declare id: string

  @Column('char', { length: VISITOR_ID_SIZE })
  declare visitorId: string

  @Column('uuid')
  declare campaignId: string

  @Column('uuid', { nullable: true })
  declare previousCampaignId: string | null

  @Column('uuid', { nullable: true })
  declare offerId: string | null

  @Column('uuid', { nullable: true })
  declare affiliateNetworkId: string | null

  @Column('uuid', { nullable: true })
  declare trafficSourceId: string | null

  @Column('uuid', { nullable: true })
  declare streamId: string | null

  @Column('text', { nullable: true })
  declare destination: string | null

  // uniq
  @Column('boolean', { nullable: true })
  declare isUniqueGlobal: boolean | null

  @Column('boolean', { nullable: true })
  declare isUniqueCampaign: boolean | null

  @Column('boolean', { nullable: true })
  declare isUniqueStream: boolean | null

  // GEO
  @Column('boolean', { nullable: true })
  declare isProxy: boolean | null

  @ColumnTextNullable()
  declare country: string | null

  @ColumnTextNullable()
  declare region: string | null

  @ColumnTextNullable()
  declare city: string | null

  @Column('inet', { nullable: true })
  declare ip: string | null

  @CreateDateColumn()
  declare createdAt: Date

  // HEADER INFO

  @ColumnTextNullable()
  declare referer: string | null

  @ColumnTextNullable()
  declare userAgent: string | null

  @Column('char', { length: 2, nullable: true })
  declare language: string | null

  // USER AGENT INFO

  @Column('boolean', { nullable: true })
  declare isBot: boolean | null

  @ColumnTextNullable()
  declare deviceType: string | null

  @ColumnTextNullable()
  declare os: string | null

  @ColumnTextNullable()
  declare osVersion: string | null

  @ColumnTextNullable()
  declare browser: string | null

  @ColumnTextNullable()
  declare browserVersion: string | null

  @ColumnTextNullable()
  declare deviceModel: string | null

  // FROM QUERY STRING

  // из параметров или из referer поисковика
  @ColumnTextNullable()
  declare keyword: string | null

  // из параметров или домен из referer
  @Column('text', { nullable: true, comment: 'Источник (из параметров)' })
  declare source: string | null

  @Column('decimal', { nullable: true, precision: 13, scale: 2 })
  declare cost: number | null

  @ColumnTextNullable()
  declare externalId: string | null

  @ColumnTextNullable()
  declare creativeId: string | null

  @ColumnTextNullable()
  declare adCampaignId: string | null

  @ColumnTextNullable()
  declare subId1: string | null

  @ColumnTextNullable()
  declare subId2: string | null

  @ColumnTextNullable()
  declare extraParam1: string | null

  @ColumnTextNullable()
  declare extraParam2: string | null
}
