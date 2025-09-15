import { name } from './common'
import { faker } from '@faker-js/faker'
import { CampaignStreamSchema, StreamActionType } from '@/domain/campaign/types'

export async function createCampaign(requestParams: any) {
  const streamCount = faker.number.int({ min: 1, max: 3 })

  requestParams.json = {
    name: name(),
    active: Math.random() >= 0.2,
    streams: Array.from({ length: streamCount }).map(() => createStream()),
  }
}

function createStream() {
  const functions = [
    () => actionText(),
    () => actionHtml(),
    () => actionNothing(),
    () => actionShow404(),
    // () => actionToCampaign(),
  ]

  const randomFunc = faker.helpers.arrayElement(functions)

  return randomFunc()
}

function actionText() {
  return {
    name: name(),
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.SHOW_TEXT,
    actionContent: 'Custom content',
  }
}

function actionHtml() {
  return {
    name: name(),
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.SHOW_HTML,
    actionContent: 'Html <b>content</b>',
  }
}

function actionNothing() {
  return {
    name: name(),
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.NOTHING,
  }
}

function actionShow404() {
  return {
    name: name(),
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.SHOW404,
  }
}

function actionToCampaign() {
  return {
    name: name(),
    schema: CampaignStreamSchema.ACTION,
    actionType: StreamActionType.TO_CAMPAIGN,
  }
}
