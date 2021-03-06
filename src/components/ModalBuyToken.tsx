import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { FormEvent, Fragment, useState } from 'react'

import { usePortfolio } from '../providers/portfolio'
import { useTokenList } from '../providers/token-list'

interface ModalBuyTokenProps {
  isOpen: boolean
  setIsOpen: Function
  tokenId: string
}

interface formMessageType {
  amount: string
  form: string
}

export function ModalBuyToken({ isOpen, setIsOpen, tokenId }: ModalBuyTokenProps) {

  const [amount, setAmount] = useState(0)
  const [formMessage, setFormMessage] = useState<formMessageType>({
    amount: '',
    form: ''
  })

  const { portfolio, setPortfolio } = usePortfolio()
  const { tokenList, setTokenList } = useTokenList()

  const indexTokenPortfolio = portfolio.findIndex(t => t.id === tokenId)
  const buyPortfolio = portfolio[indexTokenPortfolio]


  const indexBuyToken = tokenList.findIndex(t => t.id === tokenId)
  const buyToken = tokenList[indexBuyToken]

  const handleFormReset = () => {
    setIsOpen(false)
    setAmount(0)
    setFormMessage({
      amount: '',
      form: ''
    })
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()

    let valid = true
    const newFormMessage = {
      amount: '',
      form: ''
    }

    if (!amount) {
      valid = false
      newFormMessage.amount = '* Fill the token amount'
    }

    if (amount <= 0) {
      valid = false
      newFormMessage.amount = '* The token amount must be greater than 0'
    }

    if (!valid) {
      setFormMessage(newFormMessage)
      return false
    }

    if (amount) {
      setFormMessage(newFormMessage)

      let newPortfolio = portfolio
      newPortfolio[indexTokenPortfolio].amount = Math.max(0, newPortfolio[indexTokenPortfolio].amount + amount)

      setPortfolio(newPortfolio)
      handleFormReset()
    }
  }

  if (!buyToken || !buyPortfolio) {
    return <></>
  }

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
              <Dialog.Panel className="mx-auto w-[28rem] max-w-lg rounded-xl bg-foreground p-4 shadow-xl">
                <Dialog.Title className="text-lg font-medium text-white flex justify-between">
                  <div className="flex gap-2">
                    <Image
                      src={buyToken.image.thumb}
                      alt={buyToken.name}
                      width={25}
                      height={25}
                    />
                    <span>
                      Buy <strong>{buyToken.name}</strong>
                    </span>
                  </div>

                  <small>
                    Your balance: {buyPortfolio.amount}
                  </small>
                </Dialog.Title>

                {/* <Dialog.Description className="text-sm text-white/70 mt-4">
                  Your balance: {buyPortfolio.amount}
                </Dialog.Description> */}

                <form className="mt-4" onSubmit={handleFormSubmit}>

                  <div className="flex flex-col gap-2">
                    <div className="">
                      <label className="text-sm text-white/70">Amount to buy</label>
                      <input
                        autoFocus
                        value={amount}
                        type="number"
                        min="0"
                        max={buyPortfolio.amount}
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

                  <hr className="border-white/30 my-4" />

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleFormReset}
                      className="button-red"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      // onClick={handleFormSubmit}
                      className="button-green"
                    >
                      Buy
                    </button>
                  </div>

                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>

        </Dialog>
      </Transition>
    </>
  )
}