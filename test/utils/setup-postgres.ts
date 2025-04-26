import { PostgreSqlContainer } from '@testcontainers/postgresql'
import * as process from 'node:process'

export async function createTestDataSource() {
  const container = await new PostgreSqlContainer('postgres:17.2').start()

  process.env.DB_HOST = container.getHost()
  process.env.DB_PORT = container.getPort() + ''
  process.env.DB_NAME = container.getDatabase()
  process.env.DB_USER = container.getUsername()
  process.env.DB_PASS = container.getPassword()
}
