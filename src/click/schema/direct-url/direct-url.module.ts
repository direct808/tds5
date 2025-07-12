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
} from './type/index.js'
import { RedirectTypeFactory } from './redirect-type-factory.js'
import { HttpModule } from '@nestjs/axios'
import { DirectUrlService } from './direct-url.service.js'

@Module({
  imports: [HttpModule],
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
