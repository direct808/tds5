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
import { RedirectType, StreamResponse } from '../../types'
import { MaybePromise } from '@/shared/types'
import { StreamDirectUrl, StreamRedirectType } from '@/domain/campaign/types'

@Injectable()
export class RedirectTypeFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  public handle(stream: StreamDirectUrl): MaybePromise<StreamResponse> {
    return this.create(stream.redirectType).handle(stream.redirectUrl)
  }

  private create(redirectType: StreamRedirectType): RedirectType {
    switch (redirectType) {
      case StreamRedirectType.HTTP:
        return this.moduleRef.get(HttpRedirectType)
      case StreamRedirectType.META:
        return this.moduleRef.get(MetaRedirectType)
      case StreamRedirectType.CURL:
        return this.moduleRef.get(CurlRedirectType)
      case StreamRedirectType.FORM_SUBMIT:
        return this.moduleRef.get(FormSubmitRedirectType)
      case StreamRedirectType.META2:
        return this.moduleRef.get(Meta2RedirectType)
      case StreamRedirectType.JS:
        return this.moduleRef.get(JsRedirectType)
      case StreamRedirectType.IFRAME:
        return this.moduleRef.get(IframeRedirectType)
      case StreamRedirectType.REMOTE:
        return this.moduleRef.get(RemoteRedirectType)
      case StreamRedirectType.WITHOUT_REFERER:
        return this.moduleRef.get(WithoutRefererRedirectType)
    }

    const at: never = redirectType
    throw new Error(`Unknown redirectType: "${at}"`)
  }
}
