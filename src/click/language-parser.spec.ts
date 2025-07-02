import { LanguageParser } from './language-parser'

describe('LanguageParser', () => {
  let parser: LanguageParser
  let checkValue: (arg: unknown) => boolean

  beforeEach(() => {
    parser = new LanguageParser()
    checkValue = parser['checkValue']
  })

  describe('checkValue', () => {
    it('should return false if acceptLanguage is not a string', () => {
      expect(checkValue(123 as any)).toBe(false)
      expect(checkValue(null as any)).toBe(false)
      expect(checkValue(undefined as any)).toBe(false)
      expect(checkValue({} as any)).toBe(false)
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

  describe('parse', () => {
    it('should not set language if accept-language is invalid', () => {
      const args: any = {
        request: {
          headers: {
            'accept-language': 'x',
          },
        },
        clickData: {},
      }

      parser.parse(args)

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

      parser.parse(args)

      expect(args.clickData.language).toBe('en')
    })

    it('should do nothing if accept-language header is missing', () => {
      const args: any = {
        request: {
          headers: {},
        },
        clickData: {},
      }

      parser.parse(args)

      expect(args.clickData.language).toBeUndefined()
    })
  })
})
