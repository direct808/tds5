import { Button, Typography } from '@mui/material'
import { type GridColDef } from '@mui/x-data-grid'
import { EntityToolbar } from '../../components/EntityToolbar.tsx'
import { EntityTable } from '../../components/EntityTable.tsx'
import { type Params, useEntityList } from '../../services/useEntityList.ts'
import { useEntityPage } from '../../services/useEntityPage.ts'
import { affiliateNetworkApi } from '../../services/api/affiliateNetworkApi.ts'
import CreateAffiliateNetworkModal from '../../components/CreateAffiliateNetworkModal.tsx'

const COLUMNS: GridColDef[] = [{ field: 'name', headerName: 'Name', flex: 1 }]

const PARAMS: Params = {
  metrics: ['clicks'],
  rangeInterval: 'today',
  timezone: '+03:00',
}

export default function AffiliateNetworkPage() {
  const {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    rowSelectionModel,
    setRowSelectionModel,
    modal,
  } = useEntityPage()

  const { data, refetch, isLoading, deleteLoading, deleteMutate } =
    useEntityList(
      'affiliate-network',
      affiliateNetworkApi.list,
      PARAMS,
      affiliateNetworkApi.delete,
      paginationModel,
      sortModel,
    )

  return (
    <>
      {modal.isOpen && (
        <CreateAffiliateNetworkModal
          onClose={modal.close}
          onSave={() => {
            modal.close()
            void refetch()
          }}
        />
      )}

      <Typography variant="h5" gutterBottom>
        Affiliate networks
      </Typography>
      <EntityToolbar
        isSelect={rowSelectionModel.ids.size > 0}
        deleteLoading={deleteLoading}
        prepend={
          <Button variant="contained" onClick={modal.openCreate}>
            Создать
          </Button>
        }
        loading={isLoading}
        onDelete={() => deleteMutate(rowSelectionModel.ids)}
        onRefresh={() => void refetch()}
      />
      <EntityTable
        columns={COLUMNS}
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
