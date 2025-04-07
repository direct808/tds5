import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user'
import { JwtModule } from '@nestjs/jwt'
import { AppConfig } from '../config'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory(config: AppConfig) {
        return {
          global: true,
          secret: config.secret,
          signOptions: { expiresIn: config.jwtExpires },
        }
      },
      inject: [AppConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
