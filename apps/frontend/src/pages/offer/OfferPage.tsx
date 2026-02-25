import { Button, Typography } from '@mui/material'
import {
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import CreateOfferModal from '../../components/CreateOfferModal.tsx'
import { EntityToolbar } from '../../components/EntityToolbar.tsx'
import { EntityTable } from '../../components/EntityTable.tsx'
import { type Params, useEntityList } from '../../services/useEntityList.ts'
import { offerApi } from '../../services/api/offerApi.ts'

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'clicks', headerName: 'Clicks' },
  { field: 'clicks1', headerName: 'Clicks' },
  { field: 'clicks2', headerName: 'Clicks' },
  { field: 'clicks3', headerName: 'Clicks' },
  { field: 'clicks4', headerName: 'Clicks' },
  { field: 'clicks41', headerName: 'Clicks' },
  { field: 'clicks44', headerName: 'Clicks' },
  { field: 'clicks43', headerName: 'Clicks' },
  { field: 'clicks42', headerName: 'Clicks' },
]

export default function OfferPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [id, setId] = useState<string | number>()
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

  const [params] = useState<Params>({
    metrics: ['clicks'],
    rangeInterval: 'today',
    timezone: '+03:00',
  })

  const { data, refetch, isLoading, deleteLoading, deleteMutate } =
    useEntityList(
      'offer',
      offerApi.list,
      params,
      offerApi.delete,
      paginationModel,
      sortModel,
    )

  const onSave = () => {
    setModalOpen(false)
    return refetch()
  }

  useEffect(() => {
    console.log(sortModel)
  }, [sortModel])

  return (
    <>
      <CreateOfferModal
        id={id as string}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setId(undefined)
        }}
        onSave={onSave}
      />

      <Typography variant="h5" sx={{ mr: 2 }} gutterBottom>
        Offers
      </Typography>
      <EntityToolbar
        isSelect={rowSelectionModel.ids.size > 0}
        deleteLoading={deleteLoading}
        prepend={
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Создать
          </Button>
        }
        loading={isLoading}
        onDelete={() => deleteMutate(rowSelectionModel.ids)}
        onRefresh={() => refetch()}
      />
      <EntityTable
        columns={columns}
        rows={data?.rows ?? []}
        total={data?.total ?? 0}
        rowSelectionModel={rowSelectionModel}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        setRowSelectionModel={setRowSelectionModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        onEdit={(id: string | number) => {
          setId(id)
          setModalOpen(true)
        }}
      />
    </>
  )
}
