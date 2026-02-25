import { useEffect } from 'react'
import { CircularProgress, TextField } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreateOfferDto } from '../shared/api/generated'
import { offerApi } from '../services/api/offerApi.ts'
import FormModal from './FormModal.tsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  onSave: () => void
  open: boolean
  onClose: () => void
  id?: string
}

export default function CreateOfferModal({ onSave, open, onClose, id }: Props) {
  const isEdit = !!id
  const queryClient = useQueryClient()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOfferDto>()

  const { data, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offerApi.getById(id!),
    enabled: isEdit,
    // staleTime: 0,
  })

  useEffect(() => {
    if (open && data && isEdit) {
      reset(data)
      console.log('reset data', data)
    } else if (open) {
      reset({})
      console.log('reset')
    }
  }, [data, reset, open, isEdit])

  const { mutate, isPending, error } = useMutation({
    onSuccess: async () => {
      if (isEdit) {
        await queryClient.invalidateQueries({
          queryKey: ['offer', id],
        })
      }
      onSave()
    },
    mutationFn: (data: CreateOfferDto) => {
      if (isEdit) {
        return offerApi.update(id!, data)
      }

      return offerApi.create(data)
    },
  })

  const onSubmit: SubmitHandler<CreateOfferDto> = (data) => mutate(data)

  // if (isEdit && isLoading) {
  //   return <CircularProgress />
  // }

  return (
    <FormModal
      title="Create"
      error={error ? error.message.toString() : ''}
      isLoading={isPending}
      onSave={handleSubmit(onSubmit)}
      open={open}
      onClose={onClose}
    >
      {isEdit && isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Name"
            {...register('name', { required: true })}
            error={!!errors.name}
            helperText={errors.name?.type}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Url"
            {...register('url', { required: true })}
            error={!!errors.url}
            helperText={errors.url?.type}
          />
        </>
      )}
    </FormModal>
  )
}
