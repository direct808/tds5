import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../services/api/authApi.ts'
import { authService } from '../../services/authService.ts'

const schema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

/** Login page with credentials form. */
export default function LoginPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: FormData) => authApi.login(data.login, data.password),
    onSuccess: (accessToken) => {
      authService.setToken(accessToken)
      navigate('/admin')
    },
  })

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit((data) => mutate(data))}>
          <TextField
            label="Login"
            fullWidth
            margin="normal"
            error={!!errors.login}
            helperText={errors.login?.message}
            {...register('login')}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.5, mt: 2 }}
            loading={isPending}
          >
            Login
          </Button>

          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error.message}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  )
}
