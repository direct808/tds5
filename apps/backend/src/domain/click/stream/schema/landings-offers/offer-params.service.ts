import { Injectable } from '@nestjs/common'

export type OfferParams = {
  subid: string
  campaign_name: string
}

type BuildOfferUrlArgs = {
  url: string
  offerParams: string
  paramData: OfferParams
}

enum ValueType {
  token,
  string,
}

type SplitItem = {
  key: string
  type: ValueType
}

@Injectable()
export class OfferParamsService {
  public buildOfferUrl(args: BuildOfferUrlArgs): string {
    const strArr: string[] = []
    for (const { key, type } of this.split(args.offerParams)) {
      if (type === ValueType.string) {
        strArr.push(key)
        continue
      }

      strArr.push(
        this.prepareParamValue(args.paramData, key as keyof OfferParams),
      )
    }

    const params = new URLSearchParams(strArr.join(''))

    return this.joinUrlAndParams(args.url, params.toString())
  }

  private *split(offerParams: string): Generator<SplitItem> {
    let tokenStart = 0
    let strStart = 0
    for (let i = 0; i < offerParams.length; i++) {
      if (offerParams[i] === '{') {
        tokenStart = i + 1

        const str = offerParams.substring(strStart, i)
        if (str.length > 0) {
          yield { key: str, type: ValueType.string }
        }
      }
      if (offerParams[i] === '}') {
        strStart = i + 1
        yield {
          key: offerParams.substring(tokenStart, i),
          type: ValueType.token,
        }
      }
    }

    if (strStart < offerParams.length) {
      yield {
        key: offerParams.substring(strStart, offerParams.length),
        type: ValueType.string,
      }
    }
  }

  private prepareParamValue(
    paramData: OfferParams,
    key: keyof OfferParams,
  ): string {
    return encodeURIComponent(paramData[key])
  }

  private joinUrlAndParams(url: string, params: string): string {
    if (url.includes('?')) {
      return url + '&' + params
    }

    return url + '?' + params
  }
}
