import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'

export type Response = {
  rows: Array<{
    [key: string]: string
  }>
  summary: {
    [key: string]: string
  }
  total: number
}

type ListFnArgs = Params & {
  offset: number
  limit: number
  sortField: string
  sortOrder: string
}

export type Params = {
  metrics: string[]
  timezone: string
  rangeInterval: string
}

type ListFn = (args: ListFnArgs) => Promise<Response>

export function useEntityList(
  key: string,
  listFn: ListFn,
  params: Params,
  deleteFn: (args: { ids: string[] }) => Promise<void>,
  paginationModel: GridPaginationModel,
  sortModel: GridSortModel,
) {
  const queryClient = useQueryClient()

  let sortField = 'name'
  let sortOrder = 'asc'
  if (sortModel && sortModel.length > 0) {
    sortField = sortModel[0].field
    sortOrder = sortModel[0].sort!
  }
  const { data, isLoading, refetch, error, isError } = useQuery({
    queryKey: [
      key,
      paginationModel.page,
      paginationModel.pageSize,
      sortField,
      sortOrder,
    ],
    retry: 0,
    placeholderData: keepPreviousData,
    queryFn: () =>
      listFn({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        sortField,
        sortOrder,
        ...params,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      deleteFn({
        ids: Array.from(ids) as string[],
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    deleteLoading: deleteMutation.isPending,
    deleteMutate: deleteMutation.mutate,
  }
}
