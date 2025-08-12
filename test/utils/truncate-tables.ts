import { DataSource } from 'typeorm'

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
