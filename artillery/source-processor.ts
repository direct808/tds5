import { name } from './common'

export async function createSource(requestParams: any) {
  requestParams.json = {
    name: name(),
  }
}
