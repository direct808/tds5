import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '@/domain/user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AppConfig } from '@/infra/config/app-config.service'

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
