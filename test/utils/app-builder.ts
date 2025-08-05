// import { Test, TestingModule } from '@nestjs/testing'
// import { AppModule } from '@/app.module'
// import { configureApp } from '@/utils/configure-app'
// import { INestApplication } from '@nestjs/common'
//
// export class AppBuilder {
//   private _app?: INestApplication
//
//   private constructor() {}
//
//   public static create() {
//     return new this()
//   }
//
//   public async createApp() {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile()
//     this._app = moduleFixture.createNestApplication()
//     configureApp(this._app)
//     await this._app.init()
//     return this
//   }
//
//   public app(): INestApplication {
//     if (!this._app) {
//       throw new Error('No app')
//     }
//     return this._app
//   }
// }
