const config = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
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
      functions: 38,
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
