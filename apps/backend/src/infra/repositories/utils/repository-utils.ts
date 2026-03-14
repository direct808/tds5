import { BadRequestException, ConflictException } from '@nestjs/common'
import { isNullable } from '@/shared/helpers'

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

export interface ISoftDeleteMany {
  softDeleteMany(ids: string[]): Promise<void>
}

/**
 * Ensures name uniqueness when creating an entity.
 * Throws `ConflictException` if a record with the same name already exists for the given user.
 * @param repository - repository supporting lookup by name and userId
 * @param args - entity name and user identifier
 */
export async function checkUniqueNameForCreate<T>(
  repository: IGetEntityByNameAndUserId<T>,
  args: NameAndUserId,
): Promise<void> {
  const entity = await repository.getByNameAndUserId(args)

  if (entity) {
    throw new ConflictException('Record with same name already exists')
  }
}

/**
 * Ensures name uniqueness when updating an entity.
 * Throws `ConflictException` if a record with the same name exists for the given user
 * and belongs to a different entity (not the one being updated).
 * @param repository - repository supporting lookup by name and userId
 * @param args - entity name, userId, and id of the entity being updated
 */
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
 * Verifies that all requested entities exist in the database.
 * Throws `BadRequestException` if the number of found records
 * does not match the number of requested ids.
 * @param repository - repository supporting lookup by ids array and userId
 * @param args - array of ids and user identifier
 * @param message - optional error message
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
 * Performs combined validation before updating an entity:
 * checks that the record exists and (if name is provided) that the new name is unique.
 * @param repository - repository supporting lookup by id/userId and by name/userId
 * @param args - update payload: `id` and `userId` are required, `name` is optional
 */
export async function validateBeforeUpdate<
  T extends { id: string; userId: string; name?: string },
>(
  repository: IGetEntitiesByIdsAndUserId<unknown> &
    IGetEntityByNameAndUserId<{ id: string }>,
  args: T,
): Promise<void> {
  await ensureEntityExists(repository, { ids: [args.id], userId: args.userId })

  if (!isNullable(args.name)) {
    await checkUniqueNameForUpdate(repository, { ...args, name: args.name })
  }
}

/**
 * Verifies that all entities exist and performs a soft delete on them.
 * Throws `BadRequestException` if any of the records is not found.
 * @param repository - repository supporting lookup by id/userId and soft deletion
 * @param args - array of ids and user identifier
 */
export async function softDeleteManyWithCheck(
  repository: IGetEntitiesByIdsAndUserId<unknown> & ISoftDeleteMany,
  args: IdsAndUserId,
): Promise<void> {
  await ensureEntityExists(repository, args)

  await repository.softDeleteMany(args.ids)
}

/**
 * Computes the list of entity ids that should be deleted.
 * Compares existing records against the input and returns ids
 * of those not present in the input (i.e. removed by the user).
 * @param exists - existing entities with an `id` field
 * @param input - input data where `id` is optional (new records have no id)
 * @returns array of ids to be deleted
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
