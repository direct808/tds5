import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSnackbarStore } from '../services/snackbar.store.ts'

export const GlobalSnackbar = () => {
  const { open, message, severity, close } = useSnackbarStore()

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={close}>
        {message}
      </Alert>
    </Snackbar>
  )
}
