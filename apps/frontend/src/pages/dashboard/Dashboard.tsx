import { authService } from '../../services/authService.ts'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <br />
      <br />
      <br />
      <br />
      <br />
      Dashboard
      <button
        onClick={() => {
          authService.logout()
          navigate('/login')
        }}
      >
        Logout
      </button>
    </div>
  )
}
