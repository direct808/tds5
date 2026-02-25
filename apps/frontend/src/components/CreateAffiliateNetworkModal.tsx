import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreateAffiliateNetworkDto } from '../shared/api/generated'
import { affiliateNetworkApi } from '../services/api/affiliateNetworkApi.ts'

export default function CreateAffiliateNetworkModal({
  onSave,
}: {
  onSave: () => void
}) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAffiliateNetworkDto>()
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | false>(false)

  const handleOpen = () => {
    reset()
    setError(false)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleSave: SubmitHandler<CreateAffiliateNetworkDto> = (data) => {
    setLoading(true)
    setError(false)

    affiliateNetworkApi
      .create(data)
      .then((data) => {
        console.log(data)
        onSave()
        setOpen(false)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Создать
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создать</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Name"
            {...register('name', { required: true })}
            error={!!errors.name}
            helperText={errors.name?.type}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Offer params"
            {...register('offerParams', { required: false })}
          />
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            loading={isLoading}
            onClick={handleSubmit(handleSave)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
