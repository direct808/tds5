import { CampaignBuilder } from '../entity-builder/campaign-builder'
import { faker } from '@faker-js/faker'
import { PrismaClient, StreamRedirectTypeEnum } from '@generated/prisma/client'
import { CampaignModel } from '@generated/prisma/models/Campaign'

type CreateCampaignDirectUrlArgs = {
  prisma: PrismaClient
  url?: string
  redirectType: StreamRedirectTypeEnum
  userId: string
}

export function createCampaignDirectUrl({
  redirectType,
  url = faker.internet.url(),
  userId,
  prisma,
}: CreateCampaignDirectUrlArgs): Promise<CampaignModel> {
  return CampaignBuilder.create()
    .name(faker.company.name())
    .code(faker.string.alphanumeric({ length: 6 }))
    .userId(userId)
    .addStreamTypeDirectUrl((stream) => {
      stream.name(faker.company.name()).url(url).redirectType(redirectType)
    })
    .save(prisma)
}
