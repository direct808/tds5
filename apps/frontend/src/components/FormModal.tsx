import { type ReactNode } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

type Props = {
  title: string
  error: string | null
  isLoading: boolean
  onSave: () => void
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function FormModal({
  title,
  isLoading,
  error,
  onSave,
  open,
  onClose,
  children,
}: Props) {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          {children}
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" loading={isLoading} onClick={onSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
