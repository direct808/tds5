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
import { authService } from '../../services/authService.ts'
import { authApi } from '../../services/api/authApi.ts'

interface SetupPageProps {
  onComplete: () => void
}

/** First-run setup form for creating the initial admin user. */
export default function SetupPage({ onComplete }: SetupPageProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    await authApi
      .createFirstUser(login, password, confirmPassword)
      .then((accessToken) => {
        authService.setToken(accessToken)
        onComplete()
      })
      .catch((e: unknown) => {
        const msg =
          e !== null && typeof e === 'object' && 'message' in e
            ? String((e as { message: string }).message)
            : 'Unknown error'
        setError(msg)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Admin User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Login"
            fullWidth
            margin="normal"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.5, mt: 2 }}
            loading={isLoading}
          >
            Create
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
