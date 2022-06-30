import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { Header } from '../components/Header'
import { AccountSummary } from '../components/AccountSummary'
import { AccountTokenList } from '../components/AccountTokenList'
import { ModalBuyToken } from '../components/ModalBuyToken'
import { usePortfolio } from '../providers/portfolio'
import { useTokenList } from '../providers/token-list'
import { Token } from '../repositories/tokens-repository'
import { CoingeckoTokensRepository } from '../repositories/coingecko/coingecko-tokens-repository'
import { GetTokenUseCase } from '../use-cases/get-token-use-case'
import useInterval from 'use-interval'
import { count } from 'console'
import { ModalSellToken } from '../components/ModalSellToken'

const Home: NextPage = () => {
  const { portfolio, setPortfolio } = usePortfolio()
  const { tokenList, setTokenList } = useTokenList()

  const updateTokenList = async () => {
    if (!portfolio || !portfolio.length) return false

    const newTokenList: Token[] = []

    for (let { id } of portfolio) {
      const coingeckoTokensRepository = new CoingeckoTokensRepository()
      const getTokenUseCase = new GetTokenUseCase(coingeckoTokensRepository)
      const tokenInfo = await getTokenUseCase.execute({ id })

      if (tokenInfo) {
        newTokenList.push(tokenInfo)
      } else {
        const currentTokenInfo = tokenList.find(t => t.id === id)
        if (currentTokenInfo) {
          newTokenList.push(currentTokenInfo)
        }
      }
    }

    setTokenList(newTokenList)
  }

  useEffect(() => {
    updateTokenList()
  })
  useInterval(updateTokenList, 1000 * 60 * 1)


  const [isModalBuyTokenOpen, setIsModalBuyTokenOpen] = useState(false)
  const [isModalSellTokenOpen, setIsModalSellTokenOpen] = useState(false)
  const [tokenIdToSell, setTokenIdToSell] = useState<string>('')

  return (
    <>
      <Head>
        {/* <title>Create Next App</title> */}
      </Head>

      <Header />

      <AccountSummary />

      <ModalBuyToken
        isOpen={isModalBuyTokenOpen}
        setIsOpen={setIsModalBuyTokenOpen}
      />

      <ModalSellToken
        isOpen={isModalSellTokenOpen}
        setIsOpen={setIsModalSellTokenOpen}
        tokenId={tokenIdToSell}
      />

      <AccountTokenList
        isModalBuyTokenOpen={isModalBuyTokenOpen}
        setIsModalBuyTokenOpen={setIsModalBuyTokenOpen}

        setTokenIdToSell={setTokenIdToSell}
        isModalSellTokenOpen={isModalSellTokenOpen}
        setIsModalSellTokenOpen={setIsModalSellTokenOpen}
      />

    </>
  )
}

export default Home
