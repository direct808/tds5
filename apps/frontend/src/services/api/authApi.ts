import { authControllerLogin } from '../../shared/api/generated'

export const authApi = {
  async login(email: string, password: string): Promise<string> {
    const { data } = await authControllerLogin<true>({
      body: { email, password },
    })

    return data.accessToken
  },
}
