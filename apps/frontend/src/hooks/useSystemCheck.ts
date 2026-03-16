import { useEffect, useState } from 'react'
import { authService } from '../services/authService.ts'
import { authApi } from '../services/api/authApi.ts'

type SystemStatus = 'loading' | 'setup' | 'ready'

/** Checks whether the system has at least one user created. */
export function useSystemCheck() {
  const [status, setStatus] = useState<SystemStatus>(
    authService.isSystemInitialized() ? 'ready' : 'loading',
  )

  useEffect(() => {
    if (authService.isSystemInitialized()) return

    authApi.firstUserCreated().then((created) => {
      if (created) {
        authService.markSystemInitialized()
        setStatus('ready')
      } else {
        setStatus('setup')
      }
    })
  }, [])

  const markInitialized = () => {
    authService.markSystemInitialized()
    setStatus('ready')
  }

  return { status, markInitialized }
}
