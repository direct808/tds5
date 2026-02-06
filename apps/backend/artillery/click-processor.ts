import { faker } from '@faker-js/faker'

export async function randomCode(asd: any, userContext: any) {
  userContext.vars.randomCode = faker.string.alphanumeric({ length: 6 })
  //
  // return Promise.resolve()
}
