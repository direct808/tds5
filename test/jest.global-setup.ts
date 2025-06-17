import { globalSetup } from './utils/helpers'

export default async function () {
  await globalSetup()
}

// async function initializeGlobalDataSource() {
//   // @ts-ignore
//   global.globalDataSource = new DataSource({
//     type: 'postgres',
//     host: 'localhost',
//     port: 8432,
//     username: 'postgres',
//     password: '1234',
//     database: 'postgres', // соединяемся с дефолтной БД
//   })
//   // @ts-ignore
//   await global.globalDataSource.initialize()
// }
//
// async function createTestDatabase(): Promise<string> {
//   const dbName = `test_db_${Math.random().toString(36).substring(7)}`
//   // Создаем БД через глобальное соединение
//   // @ts-ignore
//   await global.globalDataSource!.query(`CREATE DATABASE ${dbName};`)
//
//   return dbName
//
//   // Создаем и возвращаем DataSource для новой БД
//   // const testDataSource = new DataSource({
//   //   type: 'postgres',
//   //   host: 'localhost',
//   //   port: 8432,
//   //   username: 'postgres',
//   //   password: '1234',
//   //   database: dbName,
//   //   synchronize: true, // автоматически создает схемы
//   //   logging: false, // отключаем логи для тестов
//   // } as PostgresConnectionOptions)
//
//   // await testDataSource.initialize()
//   // return testDataSource
// }
//
// async function dropTestDatabase(dataSource: DataSource): Promise<void> {
//   const dbName = dataSource.options.database
//   await dataSource.destroy()
//   // @ts-ignore
//   await global.globalDataSource.query(
//     `DROP DATABASE IF EXISTS ${dbName} WITH (FORCE);`,
//   )
// }
