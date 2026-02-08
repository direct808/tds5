import { useState } from 'react'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert, CircularProgress,
} from '@mui/material'
import { auth } from './auth.ts'
import { useNavigate } from 'react-router-dom'
import api from '../api/api.ts'
import { AxiosError } from 'axios'
import { client } from '../shared/api/client.gen.ts'
import { authControllerLogin } from '../shared/api'

export default function LoginForm() {
  const [email, setEmail] = useState('admin@admin.ru')
  const [password, setPassword] = useState('1234')
  const [error, setError] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await client.post({
        url: '/api/auth/login',
        body: { email, password1: '' },
      })

      const { data: { accessToken } } = await api.post('/api/auth/login', { email, password })
      client.post({ url: '/api/auth/login', body: { asd: 'asdasd' } })
      const data = await authControllerLogin({ body: { email, password } })
      auth.setToken(accessToken)
      navigate('/admin')
    } catch (e: any) {
      if (e instanceof AxiosError) {
        let msg = e.response?.data.message
        if (!msg) {
          msg = e.message
        }
        if (!msg) {
          msg = 'Unknown error'
        }
        setError(msg)
        return
      }
      setError(e.toString())
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 0 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Вход в систему
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Логин"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
            sx={{ p: 1.5, mt: 2 }}
          >
            {isLoading && <CircularProgress sx={{ mr: 1, ml: -4 }} size={20} />}
            Login
          </Button>

          {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}

        </Box>
      </Paper>
    </Container>

  )
}
