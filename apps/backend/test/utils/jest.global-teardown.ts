import { dropDb, getDbNameFromUrl } from './db-utils'

export default async function teardown(): Promise<void> {
  const { DATABASE_URL, ORIG_DATABASE_URL, TEST_USE_SINGLE_DB } = process.env

  if (TEST_USE_SINGLE_DB === 'Y') {
    return
  }

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not set')
  }

  if (!ORIG_DATABASE_URL) {
    throw new Error('ORIG_DATABASE_URL not set')
  }

  const dbName = getDbNameFromUrl(DATABASE_URL)

  await dropDb(ORIG_DATABASE_URL, dbName)
}
