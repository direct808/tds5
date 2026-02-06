import { sign } from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import type { RedirectType } from '../../../../types'
import { AppConfig } from '../../../../../../infra/config/app-config.service'

@Injectable()
export class Meta2RedirectType implements RedirectType {
  constructor(private readonly configService: AppConfig) {}

  handle: RedirectType['handle'] = (url) => {
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
