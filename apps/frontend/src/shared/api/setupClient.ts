import qs from 'qs'
import { authService } from '../../services/authService.ts'
import { client } from './generated/client.gen.ts'

client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  auth: () => authService.getToken() || undefined,
  querySerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
    }),
  throwOnError: true,
})

client.interceptors.request.use((request) => {
  const token = authService.getToken()
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
  return request
})
