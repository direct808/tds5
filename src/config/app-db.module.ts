import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from './app-config.service.js'
import { AffiliateNetwork } from '@/affiliate-network/affiliate-network.entity.js'
import { Offer } from '@/offer/offer.entity.js'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity.js'
import { Campaign } from '@/campaign/entity/campaign.entity.js'
import { User } from '@/user/user.entity.js'
import { Source } from '@/source/source.entity.js'
import { Stream } from '@/campaign/entity/stream.entity.js'
import { Click } from '@/click/click.entity.js'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(config: AppConfig) {
        return {
          type: 'postgres',
          host: config.dbHost,
          port: Number(config.dbPort),
          username: config.dbUser,
          password: config.dbPass,
          database: config.dbName,
          entities: [
            AffiliateNetwork,
            Click,
            Offer,
            Source,
            User,
            Campaign,
            Stream,
            StreamOffer,
          ],
          synchronize: true,
          logging: false,
        }
      },
      inject: [AppConfig],
    }),
  ],
})
export class AppDbModule {}
