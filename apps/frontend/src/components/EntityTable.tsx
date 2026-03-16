import {
  DataGrid,
  type GridColDef,
  type GridRowsProp,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid'

type EntityTableProps = {
  columns: GridColDef[]
  rows: GridRowsProp
  total: number
  rowSelectionModel: GridRowSelectionModel
  setRowSelectionModel: (model: GridRowSelectionModel) => void
  setPaginationModel: (model: GridPaginationModel) => void
  paginationModel: GridPaginationModel
  sortModel: GridSortModel
  setSortModel: (model: GridSortModel) => void
  onEdit?: (id: string) => void
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
}: EntityTableProps) {
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
      pageSizeOptions={[5, 10, 25]}
      paginationMode="server"
      paginationModel={paginationModel}
      autoHeight
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      onRowDoubleClick={onEdit ? (params) => onEdit(String(params.id)) : undefined}
    />
  )
}