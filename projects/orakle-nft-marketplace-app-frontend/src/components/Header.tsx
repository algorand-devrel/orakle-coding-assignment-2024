import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { ellipseAddress } from '../utils/ellipseAddress'
import ConnectWallet from './ConnectWallet'
import MintNft from './MintNft'
import Sell from './Sell'
import Withdraw from './Withdraw'

interface HeaderProps {
  algorandObject: {
    algorand: AlgorandClient
    nftmClient: NftMarketplaceClient
    listClient: NftMarketplaceListClient
  }
  setAppId: (id: number) => void
}

export function Header({ algorandObject, setAppId }: HeaderProps) {
  const { activeAddress } = useWallet()

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const [openMintModal, setOpenMintModal] = useState(false)

  const toggleWalletModal = () => {
    setOpenWalletModal((prev) => !prev)
  }
  const toggleSellModal = () => {
    setOpenSellModal((prev) => !prev)
  }
  const toggleWithdrawModal = () => {
    setOpenWithdrawModal((prev) => !prev)
  }
  const toggleMintModal = () => {
    setOpenMintModal((prev) => !prev)
  }

  const isSelling = false // TODO: Implement

  return (
    <div className="w-full px-8 py-4 top-0 flex flex-row justify-between items-center border-b border-b-teal-200">
      <div className="flex flex-row items-center gap-8 text-white">
        <span>Algorand X Orakle</span>
        <button
          className="font-bold disabled:text-gray-200"
          onClick={isSelling ? toggleWithdrawModal : toggleSellModal}
          disabled={!activeAddress}
        >
          {isSelling ? 'Withdraw Profit' : 'Sell NFT'}
        </button>
        <button className="font-bold disabled:text-gray-200" onClick={toggleMintModal} disabled={!activeAddress}>
          Mint NFT
        </button>
      </div>
      <button className="rounded-lg px-4 py-2 border border-teal-200 text-white" onClick={toggleWalletModal}>
        {activeAddress ? ellipseAddress(activeAddress) : 'Connect Wallet'}
      </button>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Sell algorandObject={algorandObject} setAppId={setAppId} openModal={openSellModal} setModalState={setOpenSellModal} />
      <Withdraw openModal={openWithdrawModal} setModalState={setOpenWithdrawModal} />
      <MintNft algorandObject={algorandObject} openModal={openMintModal} setModalState={setOpenMintModal} />
    </div>
  )
}
