import { Column, Entity, ManyToOne, Unique } from 'typeorm'
import { Stream } from './stream.entity'
import { Offer } from '@/domain/offer/offer.entity'

@Entity()
@Unique(['offerId', 'streamId'])
export class StreamOffer {
  @Column('uuid', { generated: 'uuid', primary: true })
  declare id: string

  @ManyToOne(() => Offer, (offer) => offer.id, {
    nullable: false,
  })
  declare offer?: Offer

  @Column('uuid')
  declare offerId: string

  @Column('smallint')
  declare percent: number

  @Column('boolean')
  declare active: boolean

  @ManyToOne(() => Stream, (stream) => stream.streamOffers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  declare stream: Stream

  @Column()
  declare streamId: string
}
