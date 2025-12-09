import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': ['babel-jest', { extends: './test/babel.config.js' }],
  },
  transformIgnorePatterns: ['node_modules/(?!ip6)'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@generated/(.*)$': '<rootDir>/generated/$1',
  },
  coverageThreshold: {
    global: {
      statements: 36,
      branches: 45,
      functions: 38,
      lines: 36,
    },
  },
  coveragePathIgnorePatterns: [
    '\\.repository\\.ts',
    '\\.dto\\.ts',
    '\\.module\\.ts',
    'index.ts',
    'dist',
    '/main.ts',
    '/cli.ts',
    'test/',
    'coverage',
    '/.eslintrc.js',
    '/jest.config.ts',
    '/jest.config.unit.ts',
  ],
}

export default config
