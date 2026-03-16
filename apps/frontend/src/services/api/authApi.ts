import {
  authControllerCreateFirstUser,
  authControllerGetFirstUserStatus,
  authControllerLogin,
} from '../../shared/api/generated'

export const authApi = {
  async login(login: string, password: string): Promise<string> {
    const { data } = await authControllerLogin<true>({
      body: { login, password },
    })

    return data.accessToken
  },
  async createFirstUser(
    login: string,
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    const { data } = await authControllerCreateFirstUser<true>({
      body: { login, password, confirmPassword },
    })

    return data.accessToken
  },
  async firstUserCreated(): Promise<boolean> {
    const { data } = await authControllerGetFirstUserStatus<true>()

    return data.created
  },
}
