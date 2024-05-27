/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { algorandClientAtom } from '../atoms'

//로컬 네트워크 테스트용 nft 민팅 컴포넌트

interface BuyInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const MintNft = ({ openModal, setModalState }: BuyInterface) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress } = useWallet()
  const algorandClient = useAtomValue(algorandClientAtom)

  const handleMintNft = async () => {
    setLoading(true)

    if (!signer || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    const result = await algorandClient?.send.assetCreate({
      sender: activeAddress,
      assetName: 'Orakle NFT',
      unitName: 'NFT',
      total: 10n,
      decimals: 1,
      url: `ipfs://QmUGFmpbvqsSoNP8yhLuVwQ7vYJ5MQ7VuEjrXNUUfifewx/#arc3`,
    })
    console.log(result?.confirmation.assetIndex)

    setLoading(false)
    window.location.reload()
  }

  return (
    <dialog id="buy_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint NFT</h3>
        <br />
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="send-algo" className={`btn`} onClick={handleMintNft}>
            {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default MintNft
