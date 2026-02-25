export const authService = {
  getToken: () => localStorage.getItem('token'),

  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  isAuth: () => !!localStorage.getItem('token'),
}
