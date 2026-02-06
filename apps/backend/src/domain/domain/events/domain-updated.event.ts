export const domainUpdateEventName = 'domain.updated'

export class DomainUpdatedEvent {
  constructor(public readonly name: string) {}
}
