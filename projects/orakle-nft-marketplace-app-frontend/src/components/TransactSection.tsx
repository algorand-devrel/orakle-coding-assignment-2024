import { useState } from 'react'
import Sell from './Sell'
import Withdraw from './Withdraw'

export function TransactSection() {
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const toggleSellModal = () => {
    setOpenSellModal((prev) => !prev)
  }
  const toggleWithdrawModal = () => {
    setOpenWithdrawModal((prev) => !prev)
  }

  const isSelling = false // TODO: Implement

  return (
    <section>
      <button className="rounded-lg px-4 py-2 bg-teal-700 text-white font-bold" onClick={isSelling ? toggleWithdrawModal : toggleSellModal}>
        {isSelling ? 'Withdraw Profit' : 'Sell NFT'}
      </button>
      <Sell openModal={openSellModal} setModalState={setOpenSellModal} />
      <Withdraw openModal={openWithdrawModal} setModalState={setOpenWithdrawModal} />
    </section>
  )
}
