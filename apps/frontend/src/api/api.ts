import { auth } from '../auth/auth.ts'
import { client } from '../shared/api/client.gen.ts'
import qs from 'qs'
import {
  authControllerLogin,
  type ListOfferResponseDto,
  offerControllerCreateOffer,
  type OfferControllerCreateOfferData,
  type OfferControllerCreateOfferResponses,
  offerControllerListOffers,
  type OfferControllerListOffersData,
} from '../shared/api'

client.setConfig({
  baseUrl: 'http://localhost:3300/',
  auth: () => auth.getToken() || undefined,
  querySerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
    }),
  throwOnError: true,
})

client.interceptors.request.use((request) => {
  const token = auth.getToken()
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
  return request
})

const api = {
  async login(email: string, password: string): Promise<string> {
    const { data } = await authControllerLogin<true>({
      body: { email, password },
    })

    return data.accessToken
  },
  async offerList(
    options: OfferControllerListOffersData['query'],
  ): Promise<ListOfferResponseDto> {
    const { data } = await offerControllerListOffers<true>({
      query: options,
    })

    return data
  },
  async offerCreate(
    options: OfferControllerCreateOfferData['body'],
  ): Promise<OfferControllerCreateOfferResponses[201]> {
    const { data } = await offerControllerCreateOffer<true>({
      body: options,
    })

    return data
  },
}

export default api
