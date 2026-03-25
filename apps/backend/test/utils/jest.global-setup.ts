import * as crypto from 'crypto'
import { config } from 'dotenv'
import { execa } from 'execa'
import { createDb, setDbNameInUrl, truncateTables } from './db-utils'

export default async function setup(): Promise<void> {
  config({ path: 'test/.env.e2e' })
  config({ path: '.env' })

  const { DATABASE_URL, TEST_USE_SINGLE_DB } = process.env

  if (!DATABASE_URL) {
    throw new Error('Missing DATABASE_URL')
  }

  const useSingleDb = TEST_USE_SINGLE_DB === 'Y'

  const dbName = useSingleDb
    ? `test`
    : `test_${crypto.randomBytes(8).toString('hex')}`

  await createDb(DATABASE_URL, dbName)

  process.env.ORIG_DATABASE_URL = DATABASE_URL
  process.env.DATABASE_URL = setDbNameInUrl(DATABASE_URL, dbName)

  await execa('npx', ['prisma', 'migrate', 'reset', '--force'], {
    stdio: 'inherit',
  })

  await truncateTables()
}
