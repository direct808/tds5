import type { Config } from 'jest'
import defConf from './jest.config.unit'

const config: Config = {
  ...defConf,
  rootDir: '.',
  testRegex: '.*spec\\.ts$',
  testTimeout: 30000,
  maxWorkers: 1,
  globalSetup: '<rootDir>/test/utils/jest.global-setup.ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config
