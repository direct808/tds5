import { Injectable } from '@nestjs/common'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/utils/repository-utils'
import { OfferRepository } from './offer.repository'
import { Offer } from './offer.entity'
import { AffiliateNetworkRepository } from '@/affiliate-network/affiliate-network.repository'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from '@/offer/events/offer-updated.event'

type CreateArgs = {
  name: string
  userId: string
  url: string
  affiliateNetworkId: string
}

type UpdatedArgs = {
  name?: string
  affiliateNetworkId?: string
  id: string
  userId: string
}

type EnsureNetworkExistsArgs = {
  affiliateNetworkId?: string
  userId: string
}

type DeleteArgs = {
  id: string
  userId: string
}

@Injectable()
export class OfferService {
  constructor(
    private readonly repository: OfferRepository,
    private readonly networkRepository: AffiliateNetworkRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Создание партнерской сети
   * @param args
   */
  public async create(args: CreateArgs): Promise<void> {
    await checkUniqueNameForCreate(this.repository, args)

    await this.ensureNetworkExists(args)

    await this.repository.create(args)
  }

  /**
   * Обновление партнерский сети
   * @param args
   */
  public async update(args: UpdatedArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.ensureNetworkExists(args)

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(offerUpdateEventName, new OfferUpdatedEvent(args.id))
  }

  /**
   * Список партнерских сетей
   * @param userId
   */
  public async getList(userId: string): Promise<Offer[]> {
    return this.repository.getListByUserId(userId)
  }

  /**
   * Удаление партнерской сети
   * @param args
   */
  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }

  /**
   * Проверяет существование Affiliate Network для пользователя.
   *
   * Если `affiliateNetworkId` отсутствует — метод ничего не делает.
   *
   * @param args Данные для проверки сети.
   */
  private async ensureNetworkExists(args: EnsureNetworkExistsArgs) {
    if (!args.affiliateNetworkId) {
      return
    }

    await ensureEntityExists(
      this.networkRepository,
      {
        id: args.affiliateNetworkId,
        userId: args.userId,
      },
      'Affiliate Network not found',
    )
  }
}
