import { Global, Module } from '@nestjs/common'
import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { AppConfig } from '@/infra/config/app-config.service'
import { PrismaModule } from '@/infra/prisma/prisma.module'
import { TransactionFactory } from '@/infra/database/transaction-factory'

@Global()
@Module({
  providers: [TransactionFactory],
  exports: [TransactionFactory],
  imports: [
    PrismaModule,
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
export class DatabaseModule {}
