import { CampaignBuilder } from '../entity-builder/campaign-builder'
import { StreamActionType } from '@/domain/campaign/types'
import { DataSource } from 'typeorm'
import { faker } from '@faker-js/faker'
import { Campaign } from '@/domain/campaign/entity/campaign.entity'

type CreateCampaignContentArgs = {
  dataSource: DataSource
  userId: string
  content?: string
}

export function createCampaignContent({
  dataSource,
  userId,
  content = faker.string.alphanumeric({ length: 6 }),
}: CreateCampaignContentArgs): Promise<Campaign> {
  return CampaignBuilder.create()
    .name(faker.company.name())
    .code(faker.string.alphanumeric({ length: 6 }))
    .userId(userId)
    .addStreamTypeAction((stream) => {
      stream
        .name(faker.company.name())
        .type(StreamActionType.SHOW_TEXT)
        .content(content)
    })
    .save(dataSource)
}
