import { usePortfolio, PortfolioContent } from "../providers/portfolio"
import { useTokenList, TokenListContent } from "../providers/token-list"

// interface AccountSummaryProps {
//   totalValue: number
//   diffValue: number
//   diffPercentage: number
// }

const getMyPortfolioSummary = (portfolio: PortfolioContent["portfolio"], tokenList: TokenListContent['tokenList']) => {
  let usdTotal = 0
  let usdChange24h = 0

  for (const { id, amount } of portfolio) {
    const token = tokenList.find(t => t.id === id)

    if (
      !token
      || !token.current_price
      || !token.current_price.usd
      // || !token.price_change_24h
      // || !token.price_change_24h.usd
      || !token.price_change_percentage_24h
    ) continue

    usdTotal += token.current_price.usd * amount
    // usdChange24h += token.price_change_24h.usd
    usdChange24h += token.current_price.usd * token.price_change_percentage_24h / 100
  }

  const usdTotalChange24h = usdTotal + usdChange24h

  const data = {
    usd: usdTotal,
    usd_change_24h: usdChange24h,
    percentage_change_24h: (usdTotalChange24h - usdTotal) / usdTotal * 100 || 0
  }

  return data
}

export function AccountSummary() {
  const { portfolio, setPortfolio } = usePortfolio()
  const { tokenList, setTokenList } = useTokenList()

  const { usd, usd_change_24h, percentage_change_24h } = getMyPortfolioSummary(portfolio, tokenList)

  const usdChangeClass = usd_change_24h >= 0 ? 'text-green' : 'text-red'
  const percentageChangeClass = percentage_change_24h >= 0 ? 'text-green' : 'text-red'

  // const totalValueFormatted = currencyFormatter.format(Math.abs(totalValue))
  const usdFormatted = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(usd)

  const usdChangeFormatted = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 2
  }).format(Math.abs(usd_change_24h))

  const percentageChange24hFormatted = percentage_change_24h.toFixed(2)

  return (
    <div className="flex flex-col gap-1 text-center text-white mx-auto mt-12">
      <small className="text-xs tracking-wider">TOTAL BALANCE</small>

      <div className="text-4xl">
        {usdFormatted}
      </div>

      <div className="flex gap-2 mx-auto items-center">
        <span className={`text-sm ${usdChangeClass}`}>
          {usd_change_24h >= 0 ? `${usdChangeFormatted}` : `-${usdChangeFormatted}`}
        </span>

        <span className="text-xs">|</span>

        <span className={`text-sm ${percentageChangeClass}`}>
          {percentage_change_24h > 0 ? `+${percentageChange24hFormatted}` : `${percentageChange24hFormatted}`}%
        </span>
      </div>
    </div>
  )
}