import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useAtomValue } from 'jotai'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { algorandClientAtom, appDetailsListAtom } from '../atoms'
import * as methods from '../methods'
import { getCurrentNftmClient } from '../utils/getCurrentNftmClient'

interface BuyInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
  currentAppId: bigint
  unitaryPrice: bigint
}

const Buy = ({ openModal, setModalState, currentAppId, unitaryPrice }: BuyInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress, activeAccount, clients } = useWallet()
  const algorandClient = useAtomValue(algorandClientAtom)
  const appDetails = useAtomValue(appDetailsListAtom)

  const handleBuyNft = async () => {
    setLoading(true)

    if (!signer || !activeAddress || !clients || !activeAccount) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    if (!algorandClient) {
      return
    }

    const nftmClient = getCurrentNftmClient(algorandClient, currentAppId, activeAddress, signer)

    let currentAppDetails

    for (const app of appDetails) {
      if (app.appId === currentAppId) {
        currentAppDetails = app
      }
    }

    const appAddress = algosdk.getApplicationAddress(currentAppId)
    try {
      await methods.buy(algorandClient, nftmClient, activeAddress, currentAppDetails!.assetId, appAddress, BigInt(quantity), unitaryPrice)()
    } catch (error) {
      enqueueSnackbar('Error while buying the NFT', { variant: 'error' })
      setLoading(false)
      return
    }
    enqueueSnackbar('NFT purchased successfully', { variant: 'success' })

    setLoading(false)
    window.location.reload()
  }

  return (
    <dialog id="buy_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Buy NFT</h3>
        <br />
        <div className="flex flex-col mb-3">
          <label htmlFor="asset-id" className=" mb-1 font-semibold">
            Buy Amount
          </label>
          <input
            type="number"
            data-test-id="amount"
            placeholder="0"
            className="input input-bordered w-full"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
            }}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="buy-nft" className={'btn btn-accent'} onClick={handleBuyNft}>
            {loading ? <span className="loading loading-spinner" /> : 'Buy NFT!'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Buy
