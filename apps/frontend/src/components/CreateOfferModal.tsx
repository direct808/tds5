import { useEffect } from 'react'
import { CircularProgress, TextField } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreateOfferDto } from '../shared/api/generated'
import { offerApi } from '../services/api/offerApi.ts'
import FormModal from './FormModal.tsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
  onSave: () => void
  onClose: () => void
  id?: string
}

export default function CreateOfferModal({ onSave, onClose, id }: Props) {
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
  })

  useEffect(() => {
    if (data && isEdit) {
      reset(data)
    } else {
      reset({})
    }
  }, [data, reset, isEdit])

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateOfferDto) => {
      if (isEdit) {
        return offerApi.update(id!, formData)
      }
      return offerApi.create(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offer', id] })
      onSave()
    },
  })

  const onSubmit: SubmitHandler<CreateOfferDto> = (formData) => mutate(formData)

  return (
    <FormModal
      title={isEdit ? 'Edit' : 'Create'}
      error={error ? error.message : null}
      isLoading={isPending}
      onSave={handleSubmit(onSubmit)}
      open
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
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Url"
            {...register('url', { required: 'URL is required' })}
            error={!!errors.url}
            helperText={errors.url?.message}
          />
        </>
      )}
    </FormModal>
  )
}
