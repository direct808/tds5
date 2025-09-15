import { Module } from '@nestjs/common'
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
import { RedirectTypeFactory } from './redirect-type-factory'
import { DirectUrlService } from './direct-url.service'

@Module({
  providers: [
    RedirectTypeFactory,
    DirectUrlService,

    CurlRedirectType,
    FormSubmitRedirectType,
    HttpRedirectType,
    IframeRedirectType,
    JsRedirectType,
    Meta2RedirectType,
    MetaRedirectType,
    RemoteRedirectType,
    WithoutRefererRedirectType,
  ],
  exports: [DirectUrlService],
})
export class DirectUrlModule {}
