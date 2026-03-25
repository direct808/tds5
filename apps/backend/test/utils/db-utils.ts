/* eslint-disable no-console*/

import { Client } from 'pg'
import Redis from 'ioredis'

/** Returns a new connection URL with the database name replaced by the given dbName. */
export function setDbNameInUrl(url: string, dbName: string): string {
  const u = new URL(url)
  u.pathname = `/${dbName}`

  return u.toString()
}

/** Returns the database name extracted from a PostgreSQL connection URL. */
export function getDbNameFromUrl(url: string): string {
  return new URL(url).pathname.slice(1)
}

export async function createDb(
  connectionString: string,
  dbName: string,
): Promise<void> {
  const client = new Client({ connectionString })

  await client.connect()
  try {
    await client.query(`CREATE DATABASE "${dbName}"`)
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      e.message === `database "${dbName}" already exists`
    ) {
      console.log(`Используем существующую базу данных ${dbName}`)

      return
    }
    throw e
  } finally {
    await client.end()
  }
}

export async function dropDb(
  connectionString: string,
  dbName: string,
): Promise<void> {
  const client = new Client({ connectionString })
  await client.connect()
  await client.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`)
  await client.end()
}

export async function truncateTables(): Promise<void> {
  const connectionString = `${process.env.DATABASE_URL}`

  const client = new Client({ connectionString })
  await client.connect()

  const res = await client.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  )

  if (res.rows.length === 0) {
    await client.end()

    return
  }
  const names = res.rows.map((row) => `"${row.tablename}"`).join(', ')
  await client.query(`TRUNCATE TABLE ${names} CASCADE;`)
  await client.end()
}

export async function flushRedisDb(): Promise<void> {
  const { REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD } = process.env

  if (!REDIS_HOST) {
    throw new Error('REDIS_HOST is required')
  }

  if (!REDIS_PORT) {
    throw new Error('REDIS_PORT is required')
  }

  if (!REDIS_DB) {
    throw new Error('REDIS_DB is required')
  }

  if (!REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD is required')
  }

  const redis = new Redis({
    host: REDIS_HOST,
    port: +REDIS_PORT,
    db: +REDIS_DB,
    password: REDIS_PASSWORD,
  })

  await redis.flushdb()
  await redis.quit()
}
