import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'

@Injectable()
export class FormSubmitRedirectType implements RedirectType {
  handle(url: string): StreamResponse {
    return {
      content: `<!doctype html>
<head>
  <script>window.onload = function() {
    setTimeout(function() {
      document.forms[0].submit();
    }, 0);
  };</script>
</head>
<body>
<form action="${url}" method="POST"></form>
</body>
</html>`,
    }
  }
}
