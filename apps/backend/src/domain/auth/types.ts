import { Request } from 'express'
import { UserModel } from '@generated/prisma/models/User'

export type JwrPayload = {
  sub: string
  login: string
}

export type AppRequest = Omit<Request, 'user'> & { user: JwrPayload }
export type LoginRequest = Request & { user: LoginUser }
export type LoginUser = Pick<UserModel, 'id' | 'login'>
