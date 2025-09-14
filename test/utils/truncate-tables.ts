import { DataSource } from 'typeorm'
import { Redis } from 'ioredis'

export async function truncateTables() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

  const dataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT!,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  })

  await dataSource.initialize()

  const tables: { tablename: string }[] = await dataSource.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  )
  if (tables.length === 0) {
    return
  }
  const names = tables.map((row) => `"${row.tablename}"`).join(', ')
  const sql = `TRUNCATE TABLE ${names} CASCADE;`
  await dataSource.query(sql)
  await dataSource.destroy()
}

export async function flushRedisDb() {
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
