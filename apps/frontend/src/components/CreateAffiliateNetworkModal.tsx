import { TextField } from '@mui/material'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreateAffiliateNetworkDto } from '../shared/api/generated'
import { affiliateNetworkApi } from '../services/api/affiliateNetworkApi.ts'
import FormModal from './FormModal.tsx'
import { useMutation } from '@tanstack/react-query'

type Props = {
  onSave: () => void
  onClose: () => void
}

export default function CreateAffiliateNetworkModal({
  onSave,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAffiliateNetworkDto>()

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData: CreateAffiliateNetworkDto) =>
      affiliateNetworkApi.create(formData),
    onSuccess: onSave,
  })

  const onSubmit: SubmitHandler<CreateAffiliateNetworkDto> = (formData) =>
    mutate(formData)

  return (
    <FormModal
      title="Create"
      error={error ? error.message : null}
      isLoading={isPending}
      onSave={handleSubmit(onSubmit)}
      open
      onClose={onClose}
    >
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
        label="Offer params"
        {...register('offerParams')}
      />
    </FormModal>
  )
}
