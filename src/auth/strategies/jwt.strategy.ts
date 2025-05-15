import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AppConfig } from '../../config/app-config.service'
import { JwrPayload } from '../types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    })
  }

  validate(payload: JwrPayload) {
    return payload
  }
}
