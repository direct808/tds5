import { name } from './common'
import { faker } from '@faker-js/faker'
import { StreamSchemaEnum, StreamActionTypeEnum } from '@generated/prisma/enums'

export async function createCampaign(requestParams: any): Promise<void> {
  const streamCount = faker.number.int({ min: 1, max: 3 })

  requestParams.json = {
    name: name(),
    active: Math.random() >= 0.2,
    streams: Array.from({ length: streamCount }).map(() => createStream()),
  }
}

function createStream(): void {
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

function actionText(): any {
  return {
    name: name(),
    schema: StreamSchemaEnum.ACTION,
    actionType: StreamActionTypeEnum.SHOW_TEXT,
    actionContent: 'Custom content',
  }
}

function actionHtml(): any {
  return {
    name: name(),
    schema: StreamSchemaEnum.ACTION,
    actionType: StreamActionTypeEnum.SHOW_HTML,
    actionContent: 'Html <b>content</b>',
  }
}

function actionNothing(): any {
  return {
    name: name(),
    schema: StreamSchemaEnum.ACTION,
    actionType: StreamActionTypeEnum.NOTHING,
  }
}

function actionShow404(): any {
  return {
    name: name(),
    schema: StreamSchemaEnum.ACTION,
    actionType: StreamActionTypeEnum.SHOW404,
  }
}

function actionToCampaign(): any {
  return {
    name: name(),
    schema: StreamSchemaEnum.ACTION,
    actionType: StreamActionTypeEnum.TO_CAMPAIGN,
  }
}
