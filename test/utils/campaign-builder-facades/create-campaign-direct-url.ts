import { StreamRedirectType } from '../../../src/campaign/entity/stream.entity.js'
import { DataSource } from 'typeorm'
import { CampaignBuilder } from '../../../src/utils/entity-builder/campaign-builder.js'
import { faker } from '@faker-js/faker'

type CreateCampaignDirectUrlArgs = {
  dataSource: DataSource
  url?: string
  redirectType: StreamRedirectType
  userId: string
}

export function createCampaignDirectUrl({
  redirectType,
  url = faker.internet.url(),
  userId,
  dataSource,
}: CreateCampaignDirectUrlArgs) {
  return CampaignBuilder.create()
    .name(faker.company.name())
    .code(faker.string.alphanumeric({ length: 6 }))
    .userId(userId)
    .addStreamTypeDirectUrl((stream) => {
      stream.name(faker.company.name()).url(url).redirectType(redirectType)
    })
    .save(dataSource)
}
