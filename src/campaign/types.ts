import { Stream } from '@/campaign/entity/stream.entity'
import { Campaign } from '@/campaign/entity/campaign.entity'

export type StreamWithCampaign = Stream & { campaign: Campaign }

export enum CampaignStreamSchema {
  ACTION = 'ACTION',
  DIRECT_URL = 'DIRECT_URL',
  LANDINGS_OFFERS = 'LANDINGS_OFFERS',
}

export enum StreamRedirectType {
  CURL = 'CURL',
  FORM_SUBMIT = 'FORM_SUBMIT',
  HTTP = 'HTTP',
  IFRAME = 'IFRAME',
  JS = 'JS',
  META = 'META',
  META2 = 'META2',
  REMOTE = 'REMOTE',
  WITHOUT_REFERER = 'WITHOUT_REFERER',
}

export enum StreamActionType {
  NOTHING = 'NOTHING',
  SHOW404 = 'SHOW404',
  SHOW_HTML = 'SHOW_HTML',
  SHOW_TEXT = 'SHOW_TEXT',
  TO_CAMPAIGN = 'TO_CAMPAIGN',
}

export interface StreamDirectUrl extends Stream {
  redirectType: StreamRedirectType
  redirectUrl: string
}
