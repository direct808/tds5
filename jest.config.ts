import type { Config } from 'jest'
import defConf from './jest.config.unit'

const config: Config = {
  ...defConf,
  testRegex: '.*spec\\.ts$',
  testTimeout: 30000,
  maxWorkers: 1,
  globalSetup: '<rootDir>/test/utils/jest.global-setup.ts',
}

export default config
