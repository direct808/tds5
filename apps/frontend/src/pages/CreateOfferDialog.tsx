import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'

export default function CreateOfferDialog() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSave = () => {
    console.log('Saved:', value)
    setOpen(false)
    setValue('')
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
            label="Введите текст"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
