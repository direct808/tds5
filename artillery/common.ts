import { faker } from '@faker-js/faker'

export function name() {
  return (
    faker.commerce.productName() +
    ' ' +
    faker.number.int({ min: 1111, max: 9998 })
  )
}
