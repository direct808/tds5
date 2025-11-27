import { Injectable } from '@nestjs/common'
import {
  PrismaTransaction,
  Transaction,
} from '@/infra/prisma/prisma-transaction'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class TransactionFactory {
  constructor(private readonly prisma: PrismaService) {}

  public create<T>(cb: (tr: Transaction) => T): any {
    // @ts-ignore
    return this.prisma.$transaction((tr) => {
      return cb(new PrismaTransaction(tr))
    })
  }
}
