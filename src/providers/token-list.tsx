import React, { useEffect, useState } from "react"

import { Token } from '../repositories/tokens-repository'

export interface TokenListContent {
  tokenList: Token[],
  setTokenList: (p: Token[]) => void
}

export const TokenListContext = React.createContext<TokenListContent>({
  tokenList: [],
  setTokenList: () => { }
})

interface PortfolioProviderProps {
  children: React.ReactNode
}

export const TokenListProvider = ({ children }: PortfolioProviderProps) => {
  const [tokenList, setStateTokenList] = useState<Token[]>([])

  const setTokenList = (value: Token[]) => {
    localStorage.setItem('tokenList', JSON.stringify(value))
    setStateTokenList(value)
  }

  useEffect(() => {
    const tokenStorage = localStorage.getItem('tokenList')
    if (tokenStorage) {
      setStateTokenList(JSON.parse(tokenStorage))
    }
  }, [])

  return (
    <TokenListContext.Provider value={{ tokenList, setTokenList }}>
      {children}
    </TokenListContext.Provider>
  )
}

export const useTokenList = () => React.useContext(TokenListContext)