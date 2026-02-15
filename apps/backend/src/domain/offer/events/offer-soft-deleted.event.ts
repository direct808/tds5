export const offerSoftDeletedEventName = 'offer.soft_deleted'

export class OfferSoftDeletedEvent {
  constructor(public readonly offerIds: string[]) {}
}
