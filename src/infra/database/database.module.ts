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
          // log: ['query', 'error'],
          dialect: new PostgresDialect({
            pool: new Pool({ connectionString: config.dbUrl }),
          }),
        }
      },
    }),
  ],
})
export class DatabaseModule {}
