export const offerUpdateEventName = 'offer.updated'

export class OfferUpdatedEvent {
  constructor(public readonly offerId: string) {}
}
