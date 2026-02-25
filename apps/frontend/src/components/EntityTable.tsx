import {
  DataGrid,
  type GridColDef,
  type GridRowsProp,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid'

type EntityTable = {
  columns: GridColDef[]
  rows: GridRowsProp
  total: number
  rowSelectionModel: GridRowSelectionModel
  setRowSelectionModel: () => void
  setPaginationModel: () => void
  paginationModel: GridPaginationModel
  sortModel: GridSortModel
  setSortModel: () => void
  onEdit: (id: string | number) => void
}

export function EntityTable({
  columns,
  rows,
  total,
  rowSelectionModel,
  setRowSelectionModel,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  onEdit,
}: EntityTable) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      checkboxSelection
      disableRowSelectionExcludeModel
      onRowSelectionModelChange={setRowSelectionModel}
      rowSelectionModel={rowSelectionModel}
      rowCount={total}
      pageSizeOptions={[2, 3]}
      paginationMode="server"
      paginationModel={paginationModel}
      autoHeight
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      onRowDoubleClick={(params) => {
        onEdit(params.id)
      }}
    />
  )
}
