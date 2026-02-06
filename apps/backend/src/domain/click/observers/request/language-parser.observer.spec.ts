import { LanguageParserObserver } from './language-parser.observer'
import { MockClickContext } from '../../../../../test/utils/mock-click-context.service'
import { MockRequestAdapter } from '../../../../../test/utils/mock-request-adapter'

describe('LanguageParserObserver', () => {
  let parser: LanguageParserObserver
  let clickContext: MockClickContext
  let checkValue: (arg: unknown) => boolean

  beforeEach(() => {
    clickContext = MockClickContext.create().createClickData()
    parser = new LanguageParserObserver(clickContext)
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
      clickContext.setRequestAdapter(
        MockRequestAdapter.create().setHeader('accept-language', 'x'),
      )

      parser.handle()

      const language = clickContext.getClickData().language

      expect(language).toBeUndefined()
    })

    it('should set ClickData.language if accept-language is valid', () => {
      clickContext.setRequestAdapter(
        MockRequestAdapter.create().setHeader('accept-language', 'en-US'),
      )

      parser.handle()

      expect(clickContext.getClickData().language).toBe('en')
    })

    it('should do nothing if accept-language header is missing', () => {
      clickContext.setRequestAdapter(MockRequestAdapter.create())

      parser.handle()

      expect(clickContext.getClickData().language).toBeUndefined()
    })
  })
})
