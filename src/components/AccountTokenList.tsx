import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon, DotsHorizontalIcon, DotsVerticalIcon, ScaleIcon } from "@heroicons/react/solid"
import { Fragment } from "react"
import { usePortfolio } from "../providers/portfolio"
import { useTokenList } from "../providers/token-list"
import { Token } from "../repositories/tokens-repository"

interface AccountTokenListProps {
  isModalBuyTokenOpen: boolean
  setIsModalBuyTokenOpen: Function
  isModalSellTokenOpen: boolean
  setIsModalSellTokenOpen: Function
  setTokenIdToSell: Function
}

export function AccountTokenList({
  isModalBuyTokenOpen,
  setIsModalBuyTokenOpen,

  setTokenIdToSell,
  isModalSellTokenOpen,
  setIsModalSellTokenOpen
}: AccountTokenListProps) {
  const { portfolio, setPortfolio } = usePortfolio()
  const { tokenList, setTokenList } = useTokenList()

  const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const handleOpenSellTokenModal = (token: Token) => {
    setTokenIdToSell(token.id)
    setIsModalSellTokenOpen(true)
  }

  tokenList.sort((aToken, bToken) => {
    const aPortfolio = portfolio.find(t => t.id === aToken.id)
    const bPortfolio = portfolio.find(t => t.id === bToken.id)

    if (
      !aToken.current_price
      || !aToken.current_price.usd
      || !bToken.current_price
      || !bToken.current_price.usd
      || !aPortfolio
      || !bPortfolio
    ) {
      return 0
    }

    const aTotalValue: number = aToken.current_price.usd * aPortfolio.amount
    const bTotalValue: number = bToken.current_price.usd * bPortfolio.amount

    return aTotalValue < bTotalValue ? 1 : -1
  })

  return (
    <div className="mt-14 text-white max-w-full w-[320px] px-4 mx-auto">

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold">
          My Tokens
        </h2>

        <button
          className="button-green"
          onClick={() => setIsModalBuyTokenOpen(true)}
        >
          Add Token
        </button>

      </div>

      <ul className="flex flex-col w-full gap-2">
        {tokenList.map((token) => {
          if (!token.price_change_percentage_24h) return true
          if (!token.current_price?.usd) return true

          const tokenPortfolio = portfolio.find(t => t.id === token.id)
          if (!tokenPortfolio || !tokenPortfolio.amount) return true

          // const totalValueClass = token.totalValue > 0 ? 'text-green' : 'text-red'
          const diffPercentageClass = token.price_change_percentage_24h > 0 ? 'text-green' : 'text-red'

          const percentageChange24hFormatted = token.price_change_percentage_24h.toFixed(2)

          return (
            <li key={token.symbol} className="relative flex justify-between bg-foreground p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  className="h-[100%] max-h-[25px] w-auto"
                  src={token.image.thumb}
                  alt={token.name}
                  width={25}
                  height={25}
                />

                <div>
                  <div className="text-sm font-bold">
                    {token.name}
                  </div>

                  <div className="text-xs uppercase">
                    {token.symbol}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-end justify-center">
                  <div className={`text-sm font-bold`}>
                    {currencyFormatter.format(token.current_price.usd * tokenPortfolio.amount)}
                  </div>

                  <div className={`text-xs font-bold ${diffPercentageClass}`}>
                    {token.price_change_percentage_24h > 0 ? `+${percentageChange24hFormatted}` : `${percentageChange24hFormatted}`}%
                  </div>

                </div>
                <div className="flex items-center">
                  <Menu>
                    <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 aria-expanded:bg-white/10">
                      <DotsVerticalIcon className="h-4 w-4" aria-hidden="true" />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-10 right-0 top-full mt-2 bg-background rounded p-1 w-40 ring-1 ring-foreground">
                        <Menu.Item >
                          {({ active }) => (
                            <button
                              className="w-full p-2 rounded flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground"
                              onClick={() => { handleOpenSellTokenModal(token) }}
                            >
                              {/* <ScaleIcon className={`w-5 h-5 ${active ? '' : 'text-red'}`} /> */}
                              Sell token
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

            </li>
          )
        })}
      </ul>

    </div>
  )
}