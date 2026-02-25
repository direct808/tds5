import { Typography } from '@mui/material'
import {
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { useState } from 'react'
import { EntityToolbar } from '../../components/EntityToolbar.tsx'
import { EntityTable } from '../../components/EntityTable.tsx'
import { type Params, useEntityList } from '../../services/useEntityList.ts'
import { affiliateNetworkApi } from '../../services/api/affiliateNetworkApi.ts'
import CreateAffiliateNetworkModal from '../../components/CreateAffiliateNetworkModal.tsx'

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

export default function AffiliateNetworkPage() {
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
      'affiliate-network',
      affiliateNetworkApi.list,
      params,
      affiliateNetworkApi.delete,
      paginationModel,
      sortModel,
    )

  return (
    <>
      <Typography variant="h5" sx={{ mr: 2 }} gutterBottom>
        Affiliate network
      </Typography>
      <EntityToolbar
        isSelect={rowSelectionModel.ids.size > 0}
        deleteLoading={deleteLoading}
        prepend={<CreateAffiliateNetworkModal onSave={refetch} />}
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
      />
    </>
  )
}
