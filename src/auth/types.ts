import { Request } from 'express'
import { SetMetadata } from '@nestjs/common'
import { User } from '@/user/user.entity'

export type JwrPayload = {
  sub: string
  email: string
}

export type AppRequest = Request & { user: JwrPayload }
export type LoginRequest = Request & { user: LoginUser }
export type LoginUser = Pick<User, 'id' | 'email'>

export const SKIP_AUTH = 'SKIP_AUTH'
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)
