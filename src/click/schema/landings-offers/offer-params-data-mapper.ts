import { Injectable } from '@nestjs/common'
import { Campaign } from '../../../campaign/entity/campaign.entity'
import { OfferParams } from './offer-params.service'
import { ClickData } from '../../click-data'

type ConvertArgs = {
  campaign: Campaign
  clickData: ClickData
}

@Injectable()
export class OfferParamDataMapper {
  public convert(args: ConvertArgs): OfferParams {
    if (!args.clickData.id) {
      throw new Error('No click id')
    }

    return {
      subid: args.clickData.id,
      campaign_name: args.campaign.name,
    }
  }
}
