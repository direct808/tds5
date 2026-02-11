import type { SubmitEventHandler } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { auth } from './auth.ts'
import { useNavigate } from 'react-router-dom'
import api from '../api/api.ts'

export default function LoginForm() {
  const [email, setEmail] = useState('admin@admin.ru')
  const [password, setPassword] = useState('1234')
  const [error, setError] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    await api
      .login(email, password)
      .then((accessToken) => {
        auth.setToken(accessToken)
        navigate('/admin')
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
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

          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  )
}
