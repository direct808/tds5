import {
  CampaignBuilder,
  CampaignFull,
} from '../entity-builder/campaign-builder'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { StreamActionTypeEnum } from '@generated/prisma/enums'

type CreateCampaignContentArgs = {
  prisma: PrismaService
  userId: string
  content?: string
}

export function createCampaignContent({
  prisma,
  userId,
  content = faker.string.alphanumeric({ length: 6 }),
}: CreateCampaignContentArgs): Promise<CampaignFull> {
  return CampaignBuilder.create()
    .name(faker.company.name())
    .code(faker.string.alphanumeric({ length: 6 }))
    .userId(userId)
    .addStreamTypeAction((stream) => {
      stream
        .name(faker.company.name())
        .type(StreamActionTypeEnum.SHOW_TEXT)
        .content(content)
    })
    .save(prisma)
}
