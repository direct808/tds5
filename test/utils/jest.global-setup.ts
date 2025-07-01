import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql/build/postgresql-container'

export default async function () {
  await globalSetup()
}

async function globalSetup() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config({ path: 'test/.env.e2e' })
  if (process.env.DISABLE_TESTCONTAINERS !== 'Y') {
    const data = await createTestContainer()
    setEnv(data)
  }
}

async function createTestContainer() {
  return new PostgreSqlContainer().start()
}

function setEnv(data: StartedPostgreSqlContainer) {
  process.env.DB_HOST = data.getHost()
  process.env.DB_PORT = String(data.getPort())
  process.env.DB_NAME = data.getDatabase()
  process.env.DB_USER = data.getUsername()
  process.env.DB_PASS = data.getPassword()
}
