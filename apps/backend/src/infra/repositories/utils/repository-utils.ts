import { BadRequestException, ConflictException } from '@nestjs/common'

export type NameAndUserId = { name: string; userId: string }
export type IdsAndUserId = { ids: string[]; userId: string }

type CheckUniqueNameForUpdateArgs = NameAndUserId & {
  id: string
}

export interface IGetEntityByNameAndUserId<T> {
  getByNameAndUserId(args: NameAndUserId): Promise<T | null>
}

export interface IGetEntitiesByIdsAndUserId<T> {
  getByIdsAndUserId(args: IdsAndUserId): Promise<T[]>
}

export interface IDeleteMany {
  deleteMany(ids: string[]): Promise<void>
}

export async function checkUniqueNameForCreate<T>(
  repository: IGetEntityByNameAndUserId<T>,
  args: NameAndUserId,
): Promise<void> {
  const entity = await repository.getByNameAndUserId(args)

  if (entity) {
    throw new ConflictException('Record with same name already exists')
  }
}

export async function checkUniqueNameForUpdate<T extends { id: string }>(
  repository: IGetEntityByNameAndUserId<T>,
  args: CheckUniqueNameForUpdateArgs,
): Promise<void> {
  const entity = await repository.getByNameAndUserId(args)
  if (entity && entity.id !== args.id) {
    throw new ConflictException('Record with same name already exists')
  }
}

/**
 * Check if entity exist by id and userId
 * @param repository
 * @param args
 * @param message
 */
export async function ensureEntityExists<T>(
  repository: IGetEntitiesByIdsAndUserId<T>,
  args: IdsAndUserId,
  message?: string,
): Promise<void> {
  const entity = await repository.getByIdsAndUserId(args)

  if (args.ids.length !== entity.length) {
    throw new BadRequestException(message)
  }
}

/**
 * Return ids for delete
 * @param exists
 * @param input
 */
export function getIdsForDelete<R>(
  exists: { id: R }[],
  input: { id?: R }[],
): R[] {
  const existsStreamsIds = exists.map((offer) => offer.id)
  const inputStreamsIds = input
    .filter((stream) => Boolean(stream.id))
    .map((stream) => stream.id)

  return existsStreamsIds.filter((item) => !inputStreamsIds.includes(item))
}
