import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { isSellingAtom } from '../atoms'
import { ellipseAddress } from '../utils/ellipseAddress'
import ConnectWallet from './ConnectWallet'
import Sell from './Sell'
import Withdraw from './Withdraw'

export function Header() {
  const { activeAddress } = useWallet()
  const isSelling = useAtomValue(isSellingAtom)

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  // const [openMintModal, setOpenMintModal] = useState(false)
  const [totalProfit, setTotalProfit] = useState<bigint>(0n)

  const toggleWalletModal = () => {
    setOpenWalletModal((prev) => !prev)
  }
  const toggleSellModal = () => {
    setOpenSellModal((prev) => !prev)
  }
  const toggleWithdrawModal = () => {
    setOpenWithdrawModal((prev) => !prev)
  }
  // const toggleMintModal = () => {
  //   setOpenMintModal((prev) => !prev)
  // }

  return (
    <div className="w-full px-8 py-4 top-0 flex flex-row justify-between items-center shadow-md">
      <div className="flex flex-row items-center gap-8 text-white">
        <h1 className="font-bold text-xl">Algorand X Orakle NFT Marketplace</h1>

        {/* <button className="font-bold disabled:text-gray-200" onClick={toggleMintModal} disabled={!activeAddress}>
          Mint NFT
        </button> */}
        {/* <span className="font-bold">Total Profit: {Number(totalProfit) / 1e6} ALGOs</span> */}
      </div>
      <div className="flex flex-row items-center gap-8 text-white px-4">
        <button
          className="btn btn-outline disabled:btn-disabled justify-end border-2"
          onClick={isSelling ? toggleWithdrawModal : toggleSellModal}
          disabled={!activeAddress}
        >
          {isSelling ? 'Withdraw Profit' : 'Sell NFT'}
        </button>
        <button className="btn btn-primary text-black" onClick={toggleWalletModal}>
          {activeAddress ? ellipseAddress(activeAddress) : 'Connect Wallet'}
        </button>
      </div>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Sell openModal={openSellModal} setModalState={setOpenSellModal} />
      <Withdraw setTotalProfit={setTotalProfit} openModal={openWithdrawModal} setModalState={setOpenWithdrawModal} />
      {/* <MintNft openModal={openMintModal} setModalState={setOpenMintModal} /> */}
    </div>
  )
}
