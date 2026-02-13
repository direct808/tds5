import type { SubmitEventHandler } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
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
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Login"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.5, mt: 2 }}
            loading={isLoading}
          >
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
