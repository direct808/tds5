import { Module } from '@nestjs/common'
import { UserService } from './user.service.js'
import { UserRepository } from './user.repository.js'
import { User } from './user.entity.js'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UserModule {}
