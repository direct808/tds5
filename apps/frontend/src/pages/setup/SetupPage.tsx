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
import { authApi } from '../../services/api/authApi.ts'
import { authService } from '../../services/authService.ts'

const schema = z
  .object({
    login: z.string().min(4, 'Login is required'),
    password: z.string().min(4, 'Password is required'),
    confirmPassword: z.string().min(4, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

interface SetupPageProps {
  onComplete: () => void
}

/** First-run setup form for creating the initial admin user. */
export default function SetupPage({ onComplete }: SetupPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      authApi.createFirstUser(data.login, data.password, data.confirmPassword),
    onSuccess: (accessToken) => {
      authService.setToken(accessToken)
      onComplete()
    },
  })

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Admin User
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

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ p: 1.5, mt: 2 }}
            loading={isPending}
          >
            Create
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
