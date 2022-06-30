// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { CoingeckoTokensRepository } from '../../../repositories/coingecko/coingecko-tokens-repository'
import { GetTokenUseCase } from '../../../use-cases/get-token-use-case'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }

  const coingeckoTokensRepository = new CoingeckoTokensRepository()

  const getTokenUseCase = new GetTokenUseCase(coingeckoTokensRepository)

  const tokenList = await getTokenUseCase.execute({ id })

  res.status(200).json(tokenList)
}
