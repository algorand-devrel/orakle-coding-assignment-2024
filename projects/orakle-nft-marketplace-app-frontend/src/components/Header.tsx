import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import ConnectWallet from './ConnectWallet'

export function Header() {
  const { activeAddress } = useWallet()

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  return (
    <div className="w-full p-4 top-0 flex flex-row justify-end bg-white">
      <button className="rounded-lg px-4 py-2 bg-teal-100" onClick={toggleWalletModal}>
        {activeAddress ? ellipseAddress(activeAddress) : 'Connect Wallet'}
      </button>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}
