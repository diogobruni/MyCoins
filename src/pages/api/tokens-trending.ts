// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { CoingeckoTokensRepository } from '../../repositories/coingecko/coingecko-tokens-repository'
import { GetTokensTrendingUseCase } from '../../use-cases/get-tokens-trending-use-case'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const coingeckoTokensRepository = new CoingeckoTokensRepository()

  const getTokensTrendingUseCase = new GetTokensTrendingUseCase(coingeckoTokensRepository)

  const tokenList = await getTokensTrendingUseCase.execute()

  res.status(200).json(tokenList.slice(0, 10))
}
