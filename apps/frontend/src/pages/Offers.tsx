import { Button, Toolbar, Typography } from '@mui/material'
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import api from '../api/api.ts'
import CreateOfferDialog from './CreateOfferDialog.tsx'
import type { ListOfferResponseDto } from '../shared/api'
import { Autorenew } from '@mui/icons-material'
const i = 0

export default function Offers() {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState<ListOfferResponseDto>()
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: 'include', ids: new Set() })

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID' },
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

  const loadOffers = () => {
    setLoading(true)
    api
      .offerList({
        metrics: ['clicks'],
        limit: 10,
        timezone: '+03:00',
        rangeInterval: 'today',
      })
      .then(setOffers)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOffers()
  }, [])

  // const paginationModel = { page: 0, pageSize: 5 }

  return (
    <>
      <Typography variant="h5" sx={{ mr: 2 }} gutterBottom>
        Offers
      </Typography>
      <Toolbar sx={{ pl: 0 }} disableGutters>
        <CreateOfferDialog onSave={loadOffers} />
        <Button loading={loading}>
          <Autorenew onClick={loadOffers} />
        </Button>
      </Toolbar>
      {/*</AppBar>*/}

      <pre>
        {JSON.stringify(rowSelectionModel)}
        {/*{JSON.stringify(offers)}*/}
      </pre>

      {/*{offers}*/}
      {/*<div style={{ height: 300, width: '100%' }}>*/}
      {offers && (
        <DataGrid
          rows={offers.rows}
          columns={columns}
          density="compact"
          checkboxSelection
          onRowSelectionModelChange={(newRowSelectionModel) => {
            console.log(newRowSelectionModel)
            setRowSelectionModel(newRowSelectionModel)
          }}
          rowSelectionModel={rowSelectionModel}
          getRowId={(row) => row.id}
        />
      )}
      {/*</div>*/}
    </>
  )
}
