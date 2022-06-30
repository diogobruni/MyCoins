// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { CoingeckoTokensRepository } from '../../repositories/coingecko/coingecko-tokens-repository'
import { SearchTokensUseCase } from '../../use-cases/search-tokens-use-case'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query as { query: string }

  const coingeckoTokensRepository = new CoingeckoTokensRepository()

  const searchTokensUseCase = new SearchTokensUseCase(coingeckoTokensRepository)

  const tokenList = await searchTokensUseCase.execute({ query })

  res.status(200).json(tokenList.slice(0, 10))
}
