import { auth } from '../auth/auth.ts'
import { client } from '../shared/api/client.gen.ts'
import {
  authControllerLogin,
  offerControllerListOffers,
  type OfferControllerListOffersData,
} from '../shared/api'

client.setConfig({
  baseUrl: 'http://localhost:3300/',
  auth: () => auth.getToken() || undefined,
  // throwOnError: true
})

client.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

const api = {
  async login(email: string, password: string): Promise<string> {
    const { data } = await authControllerLogin({
      body: { email, password },
      throwOnError: true,
    })
    // if (error) {
    //   throw new Error(error.message);
    // }
    return data.accessToken
  },
  async offerList(
    options: OfferControllerListOffersData['query'],
  ): Promise<any> {
    const { data } = await offerControllerListOffers({
      query: options,

      throwOnError: true,
    })
    // if (error) {
    //   throw new Error(error.message);
    // }
    return data
  },
}

export default api
