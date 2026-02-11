import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import api from '../api/api.ts'
import CreateOfferDialog from './CreateOfferDialog.tsx'

export default function Offers() {
  const [offers, setOffers] = useState<any>(null)
  // const rows: GridRowsProp = [
  //   { id: 1, name: 'Data Grid', description: 'the Community version' },
  //   { id: 2, name: 'Data Grid Pro', description: 'the Pro version' },
  //   { id: 3, name: 'Data Grid Premium', description: 'the Premium version' },
  // ]

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'clicks', headerName: 'Clicks', width: 300 },
  ]

  useEffect(() => {
    api
      .offerList({
        metrics: ['clicks'],
        limit: 100,
        timezone: '+03:00',
        rangeInterval: 'today',
      })
      .then((offers) => {
        console.log(offers)
        setOffers(offers)
      })
  }, [])

  // const paginationModel = { page: 0, pageSize: 5 }

  return (
    <>
      {/*<AppBar position="static">*/}
      <Toolbar>
        <Typography variant="h4" gutterBottom>
          Offers
        </Typography>
        <CreateOfferDialog />
      </Toolbar>
      {/*</AppBar>*/}

      {/*{offers}*/}
      <div style={{ height: 300, width: '100%' }}>
        {offers && (
          <DataGrid rows={offers.rows} columns={columns} density="compact" />
        )}
      </div>
    </>
  )
}
