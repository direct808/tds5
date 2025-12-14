export type ConversionType = {
  parameterValues: string[]
}

export const conversionTypes: Record<string, ConversionType> = {
  sale: { parameterValues: ['sale', 'sell'] },
  deposit: { parameterValues: ['deposit', 'dep'] },
  lead: { parameterValues: ['lead'] },
  rejected: { parameterValues: ['rejected', 'reject'] },
  trash: { parameterValues: ['trash'] },
  registration: { parameterValues: ['reg', 'registration'] },
}
