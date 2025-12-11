import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql/build/postgresql-container'
import { truncateTables } from './truncate-tables'
import execa from 'execa'

export default async function (): Promise<void> {
  await globalSetup()
}

async function globalSetup(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config({ path: 'test/.env.e2e' })
  if (process.env.DISABLE_TESTCONTAINERS !== 'Y') {
    const data = await createTestContainer()
    setEnv(data)
  }

  await execa('npx', ['prisma', 'db', 'push', '--force-reset'], {
    stdio: 'inherit',
  })

  await truncateTables()
}

async function createTestContainer(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer().start()
}

function setEnv(data: StartedPostgreSqlContainer): void {
  process.env.DB_HOST = data.getHost()
  process.env.DB_PORT = String(data.getPort())
  process.env.DB_NAME = data.getDatabase()
  process.env.DB_USER = data.getUsername()
  process.env.DB_PASS = data.getPassword()
}
