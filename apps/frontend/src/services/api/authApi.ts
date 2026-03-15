import { authControllerLogin } from '../../shared/api/generated'

export const authApi = {
  async login(login: string, password: string): Promise<string> {
    const { data } = await authControllerLogin<true>({
      body: { login, password },
    })

    return data.accessToken
  },
}
