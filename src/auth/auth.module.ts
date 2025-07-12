import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '@/user/user.module.js'
import { AppConfig } from '@/config/app-config.service.js'
import { LocalStrategy } from './strategies/local.strategy.js'
import { JwtStrategy } from './strategies/jwt.strategy.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'

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
