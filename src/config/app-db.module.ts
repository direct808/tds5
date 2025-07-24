import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from './app-config.service'
import { AffiliateNetwork } from '@/affiliate-network/affiliate-network.entity'
import { Offer } from '@/offer/offer.entity'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { User } from '@/user/user.entity'
import { Source } from '@/source/source.entity'
import { Stream } from '@/campaign/entity/stream.entity'
import { Click } from '@/click/click.entity'
import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely'
import { Pool } from 'pg'

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

    KyselyModule.forRootAsync({
      inject: [AppConfig],
      useFactory(config: AppConfig) {
        return {
          dialect: new PostgresDialect({
            pool: new Pool({
              host: config.dbHost,
              port: Number(config.dbPort),
              database: config.dbName,
              password: config.dbPass,
              user: config.dbUser,
            }),
          }),
        }
      },
    }),
  ],
})
export class AppDbModule {}
