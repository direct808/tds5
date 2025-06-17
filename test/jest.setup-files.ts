import { setDataFileEnv, truncateTables } from './utils/helpers'

beforeEach(() => {
  setDataFileEnv()
})

afterEach(async () => {
  await truncateTables()
})
