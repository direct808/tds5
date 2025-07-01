import { sign } from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'
import { AppConfig } from '@/config/app-config.service'

@Injectable()
export class Meta2RedirectType implements RedirectType {
  constructor(private readonly configService: AppConfig) {}

  async handle(url: string): Promise<StreamResponse> {
    const token = sign({ url }, this.configService.secret, {
      noTimestamp: true,
    })

    const gatewayUrl = '/gateway/' + token

    return {
      content: `<html>
<head>
  <meta http-equiv="REFRESH" content="1; URL='${gatewayUrl}'">
  <script type="application/javascript">window.location = "${gatewayUrl}";</script>
</head>
</html>`,
    }
  }
}
