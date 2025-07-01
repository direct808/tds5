import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'

@Injectable()
export class WithoutRefererRedirectType implements RedirectType {
  async handle(url: string): Promise<StreamResponse> {
    return {
      content: `<!doctype html>
<html>
<head></head>
<body>

<script>
    function go() {
       window.frames[0].document.body.innerHTML = '<form target="_parent" method="post" action="${url}"></form>';
        window.frames[0].document.forms[0].submit()
    }
</script>
<iframe onload="window.setTimeout('go()', 99)" src="about:blank" style="visibility:hidden"></iframe>
</body>
</html>
`,
    }
  }
}
