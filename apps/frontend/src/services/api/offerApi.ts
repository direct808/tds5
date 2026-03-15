import {
  type ListOfferResponseDto,
  offerControllerCreateOffer,
  type OfferControllerCreateOfferData,
  type OfferControllerCreateOfferResponses,
  offerControllerDeleteOffers,
  type OfferControllerDeleteOffersData,
  offerControllerListOffers,
  type OfferControllerListOffersData,
  offerControllerOfferGetById,
  type OfferControllerOfferGetByIdResponse,
  offerControllerUpdateOffer,
  type OfferControllerUpdateOfferData,
  type OfferControllerUpdateOfferResponses,
} from '../../shared/api/generated'

export const offerApi = {
  async list(
    options: OfferControllerListOffersData['query'],
  ): Promise<ListOfferResponseDto> {
    const { data } = await offerControllerListOffers<true>({
      query: options,
    })

    return data
  },
  async create(
    options: OfferControllerCreateOfferData['body'],
  ): Promise<OfferControllerCreateOfferResponses[201]> {
    const { data } = await offerControllerCreateOffer<true>({
      body: options,
    })

    return data
  },
  async update(
    id: string,
    options: OfferControllerUpdateOfferData['body'],
  ): Promise<OfferControllerUpdateOfferResponses['200']> {
    const { data } = await offerControllerUpdateOffer<true>({
      path: { id },
      body: options,
    })

    return data
  },
  async getById(id: string): Promise<OfferControllerOfferGetByIdResponse> {
    const { data } = await offerControllerOfferGetById<true>({
      path: { id },
    })

    return data
  },
  async delete(
    options: OfferControllerDeleteOffersData['body'],
  ): Promise<void> {
    await offerControllerDeleteOffers<true>({
      body: options,
    })
  },
}
