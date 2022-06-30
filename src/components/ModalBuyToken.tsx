import { Combobox, Dialog, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { usePortfolio, PortfolioToken } from '../providers/portfolio'
import { useTokenList, TokenListContent } from '../providers/token-list'
import { CoingeckoTokensRepository } from '../repositories/coingecko/coingecko-tokens-repository'

import { Token } from '../repositories/tokens-repository'
import { GetTokenUseCase } from '../use-cases/get-token-use-case'
import { GetTokensTrendingUseCase } from '../use-cases/get-tokens-trending-use-case'
import { SearchTokensUseCase } from '../use-cases/search-tokens-use-case'

interface ModalBuyTokenProps {
  isOpen: boolean
  setIsOpen: Function
}

interface formMessageType {
  token: string
  amount: string
  form: string
}

export function ModalBuyToken({ isOpen, setIsOpen }: ModalBuyTokenProps) {
  const { portfolio, setPortfolio } = usePortfolio()
  const { tokenList, setTokenList } = useTokenList()

  const [selectedToken, setSelectedToken] = useState<Token>()
  const [amount, setAmount] = useState<number>(0)
  const [formMessage, setFormMessage] = useState<formMessageType>({
    token: '',
    amount: '',
    form: ''
  })

  const [tokenDropdown, setTokenDropdown] = useState<Token[]>([])
  const [isFethingToken, setIsFethingToken] = useState<boolean>(true)
  const [query, setQuery] = useState<string>('')

  const handleFilterToken = async (queryFilter: string) => {
    if (query === queryFilter) return false

    setQuery(queryFilter)

    if (queryFilter !== '') {
      setIsFethingToken(true)
      const coingeckoTokensRepository = new CoingeckoTokensRepository()
      const searchTokensUseCase = new SearchTokensUseCase(coingeckoTokensRepository)
      const queryTokenList = await searchTokensUseCase.execute({ query: queryFilter })
      setTokenDropdown(queryTokenList.slice(0, 10))
      setIsFethingToken(false)
    }
  }

  const handleFilterTokenDebounced = useDebouncedCallback(
    (value: string) => {
      handleFilterToken(value)
    },
    300
  )

  const handleSelectToken = (token: any) => {
    setSelectedToken(token)
  }

  const handleFormReset = () => {
    setSelectedToken(undefined)
    setAmount(0)

    setIsOpen(false)
  }

  const handleFormSubmit = async () => {
    let valid = true
    const newFormMessage = {
      token: '',
      amount: '',
      form: ''
    }

    if (!selectedToken) {
      valid = false
      newFormMessage.token = '* Select the token you want'
    }

    if (!amount) {
      valid = false
      newFormMessage.amount = '* Fill the token amount'
    }

    if (!valid) {
      setFormMessage(newFormMessage)
      return false
    }

    if (selectedToken && amount) {
      setFormMessage(newFormMessage)

      let indexOwnedToken = portfolio.findIndex(t => t.id === selectedToken.id)

      if (indexOwnedToken >= 0) {
        let newPortfolio = portfolio
        newPortfolio[indexOwnedToken].amount += amount
        setPortfolio(newPortfolio)
        handleFormReset()
      } else {
        const coingeckoTokensRepository = new CoingeckoTokensRepository()
        const getTokenUseCase = new GetTokenUseCase(coingeckoTokensRepository)
        const selectedTokenInfo = await getTokenUseCase.execute({ id: selectedToken.id })

        const newPortfolioToken: PortfolioToken = {
          id: selectedToken.id,
          amount: amount
        }

        // setPortfolio((oldPortfolio: PortfolioToken[]) => [...oldPortfolio, selectedToken])
        setPortfolio([...portfolio, newPortfolioToken])
        setTokenList([...tokenList, selectedTokenInfo])
        handleFormReset()
      }
    }
  }

  useEffect(() => {
    const fillDropdownWithTrendingTokens = async () => {
      const coingeckoTokensRepository = new CoingeckoTokensRepository()
      const getTokensTrendingUseCase = new GetTokensTrendingUseCase(coingeckoTokensRepository)
      const trendingTokenList = await getTokensTrendingUseCase.execute()
      setTokenDropdown(trendingTokenList.slice(0, 10))
      setIsFethingToken(false)
    }

    fillDropdownWithTrendingTokens()
  }, [])

  return (
    <>
      <Transition
        show={isOpen}
        as={Fragment}
      >
        <Dialog
          // open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-10"
        >

          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background bg-opacity-50 backdrop-blur backdrop-filter" aria-hidden="true" />
          </Transition.Child>

          {/* Content */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="mx-auto w-[28rem] rounded-xl bg-foreground p-4 shadow-xl">
                <Dialog.Title className="text-lg font-medium text-white">Buy new token</Dialog.Title>

                <Dialog.Description className="text-sm text-white/70 mt-2">
                  Add a new token to your portfolio.
                </Dialog.Description>

                <div className="mt-4">

                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-sm text-white/70">Token</label>
                      <Combobox value={selectedToken} onChange={handleSelectToken}>
                        <div className="relative mt-1">
                          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input
                              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                              onChange={(event) => handleFilterTokenDebounced(event.target.value)}
                              displayValue={(token: Token) => token?.name || ''}
                              placeholder="Token"
                            />

                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </Combobox.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          // afterLeave={() => handleFilterToken('')}
                          >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {tokenDropdown.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                  Nothing found.
                                </div>
                              ) : (
                                isFethingToken ? (
                                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Loading...
                                  </div>
                                ) : (
                                  tokenDropdown.map((token: Token) => (
                                    <Combobox.Option
                                      key={token.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                        }`
                                      }
                                      value={token}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={`flex gap-2 items-center truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                            <img className="" src={token.image.thumb} alt="" />
                                            {token.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Combobox.Option>
                                  ))
                                )
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>

                      {formMessage.token && (
                        <p className="mt-1 text-sm text-yellow-500">
                          {formMessage.token}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className="text-sm text-white/70">Amount to buy</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full rounded-lg bg-white py-2 pl-3 text-sm leading-5 text-gray-900 shadow-md focus:ring-0"
                        placeholder="0"
                        onChange={(event) => { setAmount(parseFloat(event.target.value)) }}
                      />

                      {formMessage.amount && (
                        <p className="mt-1 text-sm text-yellow-500">
                          {formMessage.amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {formMessage.form && (
                    <p className="mt-4 text-sm text-yellow-500">
                      {formMessage.form}
                    </p>
                  )}

                  {/* <div className="relative z-0 w-full mb-6">
                    <input
                      type="email"
                      name="floating_email"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green focus:outline-none focus:ring-0 focus:border-green peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-green peer-focus:dark:text-green peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Email address
                    </label>
                  </div> */}

                  <hr className="border-white/30 my-4" />

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleFormReset}
                      className="button-red"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      onClick={handleFormSubmit}
                      className="button-green"
                    >
                      Add
                    </button>
                  </div>

                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>

        </Dialog>
      </Transition>
    </>
  )
}