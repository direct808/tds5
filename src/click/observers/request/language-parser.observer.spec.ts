import { LanguageParserObserver } from '@/click/observers/request/language-parser.observer'

describe('LanguageParserObserver', () => {
  let parser: LanguageParserObserver
  let checkValue: (arg: unknown) => boolean

  beforeEach(() => {
    parser = new LanguageParserObserver()
    checkValue = parser['checkValue']
  })

  describe('checkValue', () => {
    it('should return false if acceptLanguage is not a string', () => {
      expect(checkValue(123)).toBe(false)
      expect(checkValue(null)).toBe(false)
      expect(checkValue(undefined)).toBe(false)
      expect(checkValue({})).toBe(false)
    })

    it('should return false if acceptLanguage length is less than 2', () => {
      expect(checkValue('')).toBe(false)
      expect(checkValue('a')).toBe(false)
    })

    it('should return true for valid language strings', () => {
      expect(checkValue('en')).toBe(true)
      expect(checkValue('ru')).toBe(true)
      expect(checkValue('de')).toBe(true)
    })
  })

  describe('parseLang', () => {
    it('should return first two characters of the acceptLanguage', () => {
      expect(parser['parseLang']('en-US')).toBe('en')
      expect(parser['parseLang']('ru-RU')).toBe('ru')
      expect(parser['parseLang']('de')).toBe('de')
    })
  })

  describe('handle', () => {
    it('should not set language if accept-language is invalid', () => {
      const args: any = {
        request: {
          headers: {
            'accept-language': 'x',
          },
        },
        clickData: {},
      }

      parser.handle(args)

      expect(args.clickData.language).toBeUndefined()
    })

    it('should set ClickData.language if accept-language is valid', () => {
      const args: any = {
        request: {
          headers: {
            'accept-language': 'en-US',
          },
        },
        clickData: {},
      }

      parser.handle(args)

      expect(args.clickData.language).toBe('en')
    })

    it('should do nothing if accept-language header is missing', () => {
      const args: any = {
        request: {
          headers: {},
        },
        clickData: {},
      }

      parser.handle(args)

      expect(args.clickData.language).toBeUndefined()
    })
  })
})
