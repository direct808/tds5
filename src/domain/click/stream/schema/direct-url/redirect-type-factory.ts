import { ModuleRef } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import {
  CurlRedirectType,
  FormSubmitRedirectType,
  HttpRedirectType,
  IframeRedirectType,
  JsRedirectType,
  Meta2RedirectType,
  MetaRedirectType,
  RemoteRedirectType,
  WithoutRefererRedirectType,
} from './type'
import { RedirectType, StreamResponse } from '../../../types'
import { MaybePromise } from '@/shared/types'
import { StreamDirectUrl } from '@/domain/campaign/types'
import { StreamRedirectTypeEnum } from '@generated/prisma/enums'

@Injectable()
export class RedirectTypeFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  public handle(stream: StreamDirectUrl): MaybePromise<StreamResponse> {
    return this.create(stream.redirectType).handle(stream.redirectUrl)
  }

  private create(redirectType: StreamRedirectTypeEnum): RedirectType {
    switch (redirectType) {
      case StreamRedirectTypeEnum.HTTP:
        return this.moduleRef.get(HttpRedirectType)
      case StreamRedirectTypeEnum.META:
        return this.moduleRef.get(MetaRedirectType)
      case StreamRedirectTypeEnum.CURL:
        return this.moduleRef.get(CurlRedirectType)
      case StreamRedirectTypeEnum.FORM_SUBMIT:
        return this.moduleRef.get(FormSubmitRedirectType)
      case StreamRedirectTypeEnum.META2:
        return this.moduleRef.get(Meta2RedirectType)
      case StreamRedirectTypeEnum.JS:
        return this.moduleRef.get(JsRedirectType)
      case StreamRedirectTypeEnum.IFRAME:
        return this.moduleRef.get(IframeRedirectType)
      case StreamRedirectTypeEnum.REMOTE:
        return this.moduleRef.get(RemoteRedirectType)
      case StreamRedirectTypeEnum.WITHOUT_REFERER:
        return this.moduleRef.get(WithoutRefererRedirectType)
    }

    const at: never = redirectType
    throw new Error(`Unknown redirectType: "${at}"`)
  }
}
