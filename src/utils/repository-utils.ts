import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
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

export async function ensureEntityExists(
  repository: IGetEntityByIdAndUserId,
  args: IdAndUserId,
): Promise<void> {
  const entity = await repository.getByIdAndUserId(args)

  if (!entity) {
    throw new NotFoundException()
  }
}
