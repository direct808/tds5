import { StreamResponse } from '../../../types'
import { StreamFullWithCampaign } from '@/domain/campaign/types'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClickData } from '../../../click-data'
import { SelectOfferService } from './select-offer.service'
import { OfferParamsService } from './offer-params.service'
import { OfferParamDataMapper } from './offer-params-data-mapper'
import {
  ClickContext,
  IClickContext,
} from '@/domain/click/shared/click-context.service'
import { OfferModel } from '../../../../../../generated/prisma/models/Offer'
import { CampaignModel } from '../../../../../../generated/prisma/models/Campaign'

@Injectable()
export class LandingsOffersService {
  constructor(
    private readonly selectOfferService: SelectOfferService,
    private readonly offerParamsService: OfferParamsService,
    private readonly offerParamDataMapper: OfferParamDataMapper,
    @Inject(ClickContext) private readonly clickContext: IClickContext,
  ) {}

  public handle(stream: StreamFullWithCampaign): StreamResponse {
    const clickData = this.clickContext.getClickData()

    if (!stream.streamOffers || !stream.streamOffers.length) {
      throw new Error('No streamOffers')
    }

    const offer = this.selectOfferService.select(stream.streamOffers)

    this.setClickData(clickData, offer)

    const url = this.buildOfferUrl(
      offer.affiliateNetwork?.offerParams || undefined,
      stream.campaign,
      offer.url,
      clickData,
    )

    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url,
    }
  }

  private setClickData(clickData: ClickData, offer: OfferModel): void {
    clickData.offerId = offer.id
    clickData.affiliateNetworkId = offer.affiliateNetworkId
  }

  private buildOfferUrl(
    offerParams: string | undefined,
    campaign: CampaignModel,
    offerUrl: string,
    clickData: ClickData,
  ): string {
    if (!offerParams) {
      return offerUrl
    }

    const paramData = this.offerParamDataMapper.convert({
      campaign: campaign,
      clickData: clickData,
    })

    return this.offerParamsService.buildOfferUrl({
      offerParams: offerParams,
      url: offerUrl,
      paramData,
    })
  }
}
