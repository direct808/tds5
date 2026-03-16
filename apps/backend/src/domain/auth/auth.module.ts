import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AppConfig } from '@/infra/config/app-config.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { CreateFirstUserUseCase } from '@/domain/auth/use-cases/create-first-user.use-case'
import { GetFirstUserStatusUseCase } from '@/domain/auth/use-cases/get-first-user-status.use-case'

@Module({
  imports: [
    RepositoryModule,
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
    CreateFirstUserUseCase,
    GetFirstUserStatusUseCase,
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
