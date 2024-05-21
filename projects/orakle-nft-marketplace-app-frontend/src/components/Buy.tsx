import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useAtomValue } from 'jotai'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { algorandClientAtom, appDetailsListAtom } from '../atoms'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import * as methods from '../methods'

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

  const { signer, activeAddress } = useWallet()
  const algorandClient = useAtomValue(algorandClientAtom)
  const appDetails = useAtomValue(appDetailsListAtom)

  const handleBuyNft = async () => {
    setLoading(true)

    if (!signer || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    if (!algorandClient) {
      return
    }

    const nftmClient = new NftMarketplaceClient(
      {
        resolveBy: 'id',
        id: currentAppId,
        sender: { addr: activeAddress!, signer },
      },
      algorandClient.client.algod,
    )

    console.log('appDetails', appDetails)

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
  }

  return (
    <dialog id="buy_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Buy NFT</h3>
        <br />
        <input
          type="number"
          data-test-id="amount"
          placeholder="How many do you want to buy?"
          className="input input-bordered w-full"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value)
          }}
        />
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="buy-nft" className={'btn'} onClick={handleBuyNft}>
            {loading ? <span className="loading loading-spinner" /> : 'Buy NFT!'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Buy
