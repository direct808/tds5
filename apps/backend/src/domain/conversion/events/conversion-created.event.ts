export const conversionCreatedEventName = 'conversion.created'

export class ConversionCreatedEvent {
  constructor(public readonly conversionId: string) {}
}
