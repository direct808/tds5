import { ObjectLiteral } from 'typeorm/common/ObjectLiteral.js'
import { ConflictException, NotFoundException } from '@nestjs/common'

export type NameAndUserId = { name: string; userId: string }
export type IdAndUserId = { id: string; userId: string }

type CheckUniqueNameForUpdateArgs = NameAndUserId & {
  id: string
}

export interface IGetEntityByNameAndUserId {
  getByNameAndUserId(args: NameAndUserId): Promise<ObjectLiteral | null>
}

export interface IGetEntityByIdAndUserId {
  getByIdAndUserId(args: IdAndUserId): Promise<ObjectLiteral | null>
}

export async function checkUniqueNameForCreate(
  repository: IGetEntityByNameAndUserId,
  args: NameAndUserId,
): Promise<void> {
  const entity = await repository.getByNameAndUserId(args)

  if (entity) {
    throw new ConflictException('Record with same name already exists')
  }
}

export async function checkUniqueNameForUpdate(
  repository: IGetEntityByNameAndUserId,
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
export async function ensureEntityExists(
  repository: IGetEntityByIdAndUserId,
  args: IdAndUserId,
  message?: string,
): Promise<void> {
  const entity = await repository.getByIdAndUserId(args)

  if (!entity) {
    throw new NotFoundException(message)
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
