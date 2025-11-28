import { Redis } from 'ioredis'
import { Client } from 'pg'

export async function truncateTables(): Promise<void> {
  const connectionString = `${process.env.DATABASE_URL}`

  const client = new Client({ connectionString })
  await client.connect()

  // const adapter = new PrismaPg({ connectionString })
  // const prisma = new PrismaClient({ adapter })

  // await prisma.$connect()

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
