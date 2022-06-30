import React, { useEffect, useState } from "react"

export interface PortfolioToken {
  id: string
  amount: number
}

export interface PortfolioContent {
  portfolio: PortfolioToken[],
  setPortfolio: (p: PortfolioToken[]) => void
}

export const PortfolioContext = React.createContext<PortfolioContent>({
  portfolio: [],
  setPortfolio: () => { }
})

interface PortfolioProviderProps {
  children: React.ReactNode
}

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [portfolio, setStatePortfolio] = useState<PortfolioToken[]>([])

  const setPortfolio = (value: PortfolioToken[]) => {
    localStorage.setItem('portfolio', JSON.stringify(value))
    setStatePortfolio(value)
  }

  useEffect(() => {
    const portfolioStorage = localStorage.getItem('portfolio')
    if (portfolioStorage) {
      setStatePortfolio(JSON.parse(portfolioStorage))
    }
  }, [])

  return (
    <PortfolioContext.Provider value={{ portfolio, setPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => React.useContext(PortfolioContext)