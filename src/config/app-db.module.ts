import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from './app-config.service'
import { AffiliateNetwork } from '../affiliate-network'
import { Offer } from '../offer/'
import { Source } from '../source'
import { User } from '../user'

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
          entities: [AffiliateNetwork, Offer, Source, User],
          synchronize: true,
          logging: false,
        }
      },
      inject: [AppConfig],
    }),
  ],
})
export class AppDbModule {}
