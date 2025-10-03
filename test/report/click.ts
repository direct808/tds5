import { Click } from '@/domain/click/click.entity'
import { Conversion } from '@/domain/conversion/conversion.entity'
import { ClickBuilder } from '../utils/entity-builder/click-builder'
import { DataSource } from 'typeorm'
import { ConversionBuilder } from '../utils/entity-builder/conversion-builder'
import { faker } from '@faker-js/faker/.'

type PartialClick = Partial<Omit<Click, 'conversions'>> & {
  conversions: Partial<Conversion>[]
}

// export const clicks: PartialClick[] = [
//   {
//     visitorId: 'asdasd',
//     cost: 4,
//     conversions: [
//       { status: 'sale', revenue: 1 },
//       { status: 'lead', revenue: 2 },
//       { status: 'lead', revenue: 3 },
//     ],
//   },
// ]

type CreateClickArgs = {
  clicks: PartialClick[]
  dataSource: DataSource
  campaignId: string
}

export async function createClicks({
  clicks,
  dataSource,
  campaignId,
}: CreateClickArgs): Promise<void> {
  for (const clickData of clicks) {
    const click = await ClickBuilder.create(clickData as Click)
      .campaignId(campaignId)
      .id(faker.string.alphanumeric(10))
      .save(dataSource)
    for (const conversion of click.conversions) {
      await ConversionBuilder.create(conversion as Conversion)
        .clickId(click.id)
        .save(dataSource)
    }
  }
}
