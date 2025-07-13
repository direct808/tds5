import defConf from './jest.config.unit.mjs'

const config = {
  ...defConf,
  rootDir: '.',
  testRegex: '.*spec\\.ts$',
  testTimeout: 30000,
  maxWorkers: 1,
  globalSetup: '<rootDir>/test/utils/jest.global-setup.ts',
}

export default config
