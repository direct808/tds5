import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from './app-config.service'

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
          entities: ['./**/*.entity.js'],
          synchronize: true,
          logging: false,
        }
      },
      inject: [AppConfig],
    }),
  ],
})
export class AppDbModule {}
