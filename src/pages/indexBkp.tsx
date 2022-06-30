import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import { Header } from '../components/Header'
import { AccountSummary } from '../components/AccountSummary'
import { AccountTokenList } from '../components/AccountTokenList'
import { ModalBuyToken } from '../components/ModalBuyToken'

import { Token } from '../components/AccountTokenList'

interface AccountSummaryProps {
  totalValue: number
  diffValue: number
  diffPercentage: number
}

const Home: NextPage = () => {
  const [isModalBuyTokenOpen, setIsModalBuyTokenOpen] = useState(false)
  const [isModalSellTokenOpen, setIsModalSellTokenOpen] = useState(false)

  const [accountSummary, setAccountSummary] = useState<AccountSummaryProps>({
    totalValue: 100,
    diffValue: 10,
    diffPercentage: 5,
  })

  const tokenList = [
    {
      image: 'https://www.mobiokit.com/cryptex/cryptex/images/logos/ethereum.png',
      name: 'Ethereum',
      symbol: 'ETH',
      totalValue: 321,
      diffPercentage: -1.89,
    },
    {
      image: 'https://www.mobiokit.com/cryptex/cryptex/images/logos/ethereum.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      totalValue: 467,
      diffPercentage: 0.12,
    },
    {
      image: 'https://www.mobiokit.com/cryptex/cryptex/images/logos/ethereum.png',
      name: 'BNB',
      symbol: 'BNB',
      totalValue: 612,
      diffPercentage: -0.44,
    }
  ]

  const [accountTokenList, setAccountTokenList] = useState<Token[]>(tokenList)


  return (
    <>
      <Head>
        {/* <title>Create Next App</title> */}
      </Head>

      <Header />

      <AccountSummary
        totalValue={accountSummary.totalValue}
        diffValue={accountSummary.diffValue}
        diffPercentage={accountSummary.diffPercentage}
      />

      <ModalBuyToken
        isOpen={isModalBuyTokenOpen}
        setIsOpen={setIsModalBuyTokenOpen}
      />

      <AccountTokenList
        tokenList={tokenList}
        isModalBuyTokenOpen={isModalBuyTokenOpen}
        setIsModalBuyTokenOpen={setIsModalBuyTokenOpen}
      />

    </>
  )
}

export default Home
