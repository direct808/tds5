import { Injectable } from '@nestjs/common'
import {
  PrismaTransaction,
  Transaction,
} from '@/infra/prisma/prisma-transaction'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class TransactionFactory {
  constructor(private readonly prisma: PrismaService) {}

  public create<T>(fn: (prisma: Transaction) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tr) => {
      return fn(new PrismaTransaction(tr))
    })
  }
}
