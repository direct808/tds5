import { auth } from '../auth/auth.ts'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
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
