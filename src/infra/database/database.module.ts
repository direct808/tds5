import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AffiliateNetwork } from '@/domain/affiliate-network/affiliate-network.entity'
import { Offer } from '@/domain/offer/offer.entity'
import { StreamOffer } from '@/domain/campaign/entity/stream-offer.entity'
import { Campaign } from '@/domain/campaign/entity/campaign.entity'
import { User } from '@/domain/user/user.entity'
import { Source } from '@/domain/source/source.entity'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { Click } from '@/domain/click/click.entity'
import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { AppConfig } from '@/infra/config/app-config.service'
import { Conversion } from '@/domain/conversion/conversion.entity'

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
            Conversion,
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
          log: ['query', 'error'],
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
export class DatabaseModule {}
