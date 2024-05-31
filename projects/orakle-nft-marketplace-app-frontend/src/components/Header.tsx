import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { algorandClientAtom, isSellingAtom } from '../atoms'
import { ellipseAddress } from '../utils/ellipseAddress'
import ConnectWallet from './ConnectWallet'
import MintNft from './MintNft'
import Sell from './Sell'
import Withdraw from './Withdraw'

export function Header() {
  const { activeAddress } = useWallet()
  const isSelling = useAtomValue(isSellingAtom)
  const algorandClient = useAtomValue(algorandClientAtom)

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  const [openMintModal, setOpenMintModal] = useState(false)
  const [assetHolding, setAssetHolding] = useState<bigint[]>([])

  const toggleWalletModal = () => {
    setOpenWalletModal((prev) => !prev)
  }
  const toggleSellModal = () => {
    if (activeAddress && algorandClient) {
      algorandClient!.account.getInformation(activeAddress!).then((info) => {
        const listOfAssetsHolding = []
        for (const asset of info.assets!) {
          listOfAssetsHolding.push(BigInt(asset.assetId))
        }
        setAssetHolding(listOfAssetsHolding)
      })
    }
    setOpenSellModal((prev) => !prev)
  }
  const toggleWithdrawModal = () => {
    setOpenWithdrawModal((prev) => !prev)
  }
  const toggleMintModal = () => {
    setOpenMintModal((prev) => !prev)
  }

  return (
    <div className="w-full px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md">
      <div className="flex flex-row items-center gap-8 text-white">
        <h1 className="font-bold text-xl py-2">Algorand X Orakle NFT Marketplace</h1>
      </div>
      <div className="flex flex-row items-center gap-8 text-white px-4">
        <button className="btn btn-outline disabled:btn-disabled justify-end border-2" onClick={toggleMintModal} disabled={!activeAddress}>
          Mint Test NFT
        </button>
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
      <Sell assetHolding={assetHolding} openModal={openSellModal} setModalState={setOpenSellModal} />
      <Withdraw openModal={openWithdrawModal} setModalState={setOpenWithdrawModal} />
      <MintNft openModal={openMintModal} setModalState={setOpenMintModal} />
    </div>
  )
}
