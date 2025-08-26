import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'

@Injectable()
export class JsRedirectType implements RedirectType {
  handle(url: string): StreamResponse {
    return {
      content: `<html>
<head>
  <script type="application/javascript">
    function process() {
      if (window.location !== window.parent.location) {
        top.location = "${url}";
      } else {
        window.location = "${url}";
      }
    }

    window.onerror = process;
    process();</script>
</head>
<body>
The Document has moved <a href="${url}">here</a>
</body>
</html>
      `,
    }
  }
}
