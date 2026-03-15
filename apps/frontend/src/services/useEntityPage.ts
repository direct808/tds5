import { useState } from 'react'
import {
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid'

export function useEntityPage() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  })
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set<string>(),
    })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [editId, setEditId] = useState<string>()
  const [modalOpen, setModalOpen] = useState(false)

  const openCreate = () => {
    setEditId(undefined)
    setModalOpen(true)
  }

  const openEdit = (id: string) => {
    setEditId(id)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(undefined)
  }

  return {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    rowSelectionModel,
    setRowSelectionModel,
    modal: {
      isOpen: modalOpen,
      editId,
      openCreate,
      openEdit,
      close: closeModal,
    },
  }
}
