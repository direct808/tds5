export const sourceUpdateEventName = 'source.updated'

export class SourceUpdatedEvent {
  constructor(public readonly sourceId: string) {}
}
