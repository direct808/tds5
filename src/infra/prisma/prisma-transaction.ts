import { Injectable } from '@nestjs/common'
import * as runtime from '@prisma/client/runtime/client'
import { PrismaClient } from '@generated/prisma/client'

export interface Transaction {
  get(): void
}

@Injectable()
export class PrismaTransaction implements Transaction {
  constructor(
    private readonly prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ) {}

  get(): Omit<PrismaClient, runtime.ITXClientDenyList> {
    return this.prisma
  }
}

export function prismaTransaction(trx: Transaction): PrismaTransaction {
  if (!(trx instanceof PrismaTransaction)) {
    throw new Error('Not PrismaTransaction')
  }

  return trx
}
