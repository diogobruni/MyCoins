import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useInterval from 'use-interval'

import { usePortfolio } from '../providers/portfolio'
import { useTokenList } from '../providers/token-list'

import { Token } from '../repositories/tokens-repository'
import { CoingeckoTokensRepository } from '../repositories/coingecko/coingecko-tokens-repository'
import { GetTokenUseCase } from '../use-cases/get-token-use-case'

import { Header } from '../components/Header'
import { AccountSummary } from '../components/AccountSummary'
import { AccountTokenList } from '../components/AccountTokenList'
import { ModalSearchAndBuyToken } from '../components/ModalSearchAndBuyToken'
import { ModalBuyToken } from '../components/ModalBuyToken'
import { ModalSellToken } from '../components/ModalSellToken'
import GithubCorner from '../components/GithubCorner'

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
  }, [])
  useInterval(updateTokenList, 1000 * 60 * 1)


  const [isModalSearchAndBuyTokenOpen, setIsModalSearchAndBuyTokenOpen] = useState(false)
  const [isModalBuyTokenOpen, setIsModalBuyTokenOpen] = useState(false)
  const [isModalSellTokenOpen, setIsModalSellTokenOpen] = useState(false)
  const [tokenIdToTrade, setTokenIdToTrade] = useState<string>('')

  return (
    <>
      <Head>
        {/* <title>Create Next App</title> */}
      </Head>

      <GithubCorner />

      <Header />

      <AccountSummary />

      <ModalSearchAndBuyToken
        isOpen={isModalSearchAndBuyTokenOpen}
        setIsOpen={setIsModalSearchAndBuyTokenOpen}
      />

      <ModalBuyToken
        isOpen={isModalBuyTokenOpen}
        setIsOpen={setIsModalBuyTokenOpen}
        tokenId={tokenIdToTrade}
      />

      <ModalSellToken
        isOpen={isModalSellTokenOpen}
        setIsOpen={setIsModalSellTokenOpen}
        tokenId={tokenIdToTrade}
      />

      <AccountTokenList
        isModalSearchAndBuyTokenOpen={isModalSearchAndBuyTokenOpen}
        setIsModalSearchAndBuyTokenOpen={setIsModalSearchAndBuyTokenOpen}

        setTokenIdToTrade={setTokenIdToTrade}

        isModalBuyTokenOpen={isModalBuyTokenOpen}
        setIsModalBuyTokenOpen={setIsModalBuyTokenOpen}

        isModalSellTokenOpen={isModalSellTokenOpen}
        setIsModalSellTokenOpen={setIsModalSellTokenOpen}
      />

    </>
  )
}

export default Home
