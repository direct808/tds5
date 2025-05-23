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
import { HttpModule } from '@nestjs/axios'
import { DirectUrlService } from './direct-url.service'

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
