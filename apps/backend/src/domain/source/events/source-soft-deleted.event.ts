export const sourceSoftDeletedEventName = 'source.soft_deleted'

export class SourceSoftDeletedEvent {
  constructor(public readonly sourceIds: string[]) {}
}
