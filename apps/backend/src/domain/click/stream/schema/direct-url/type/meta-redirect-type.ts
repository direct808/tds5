import { Injectable } from '@nestjs/common'
import type { RedirectType } from '@/domain/click/types'

@Injectable()
export class MetaRedirectType implements RedirectType {
  handle: RedirectType['handle'] = (url) => {
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
