import { Button, Toolbar } from '@mui/material'
import { Autorenew } from '@mui/icons-material'
import { type MouseEventHandler, type ReactNode } from 'react'

type EntityToolbarProps = {
  prepend: ReactNode
  isSelect: boolean
  onDelete: MouseEventHandler
  onRefresh: MouseEventHandler
  deleteLoading: boolean
  loading: boolean
}

export function EntityToolbar({
  prepend,
  isSelect,
  onDelete,
  onRefresh,
  deleteLoading,
  loading,
}: EntityToolbarProps) {
  return (
    <Toolbar sx={{ pl: 0, gap: 2 }} disableGutters>
      {isSelect ? (
        <Button
          color="error"
          variant="contained"
          onClick={onDelete}
          loading={deleteLoading}
        >
          Delete
        </Button>
      ) : (
        <>
          {prepend}
          <Button loading={loading} onClick={onRefresh}>
            <Autorenew />
          </Button>
        </>
      )}
    </Toolbar>
  )
}
