import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'

@Injectable()
export class MetaRedirectType implements RedirectType {
  async handle(url: string): Promise<StreamResponse> {
    return {
      content: `<html>
<head>
  <meta http-equiv="REFRESH" content="1; URL='${url}'">
  <script type="application/javascript">window.location = "${url}";</script>
</head>
</html>
      `,
    }
  }
}
