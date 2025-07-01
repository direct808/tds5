import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageThreshold: {
    global: {
      statements: 36,
      branches: 45,
      functions: 39,
      lines: 36,
    },
  },
  coveragePathIgnorePatterns: [
    '\\.entity\\.ts',
    '\\.repository\\.ts',
    '\\.dto\\.ts',
    '\\.module\\.ts',
    'index.ts',
    '/main.ts',
  ],
}

export default config
