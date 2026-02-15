export const domainSoftDeletedEventName = 'domain.soft_deleted'

export class DomainSoftDeletedEvent {
  constructor(public readonly domainIds: string[]) {}
}
