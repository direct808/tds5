import { auth } from '../auth/auth.ts'
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
          auth.logout()
          navigate('/login')
        }}
      >
        Logout
      </button>
    </div>
  )
}
