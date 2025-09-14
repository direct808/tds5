import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '@/infra/repositories/user.repository'

@Module({
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UserModule {}
