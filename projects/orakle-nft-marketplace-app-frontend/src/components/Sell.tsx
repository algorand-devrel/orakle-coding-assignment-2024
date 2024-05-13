import * as algokit from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import * as methods from '../methods'

interface SellInterface {
  algorandObject: {
    algorand: algokit.AlgorandClient
    nftmClient: NftMarketplaceClient
    listClient: NftMarketplaceListClient
  }
  setAppId: (id: number) => void
  openModal: boolean
  setModalState: (value: boolean) => void
}

// TODO: Implement sell tx call
const Sell = ({ algorandObject, setAppId, openModal, setModalState }: SellInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [assetIdToSell, setAssetIdToSell] = useState<string>('')
  const [unitaryPrice, setUnitaryPrice] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress } = useWallet()

  const handleMethodCall = async () => {
    setLoading(true)

    if (!signer || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    try {
      await methods.create(
        algorandObject.algorand,
        algorandObject.nftmClient,
        algorandObject.listClient,
        activeAddress,
        BigInt(unitaryPrice!) * BigInt(1e6),
        10n,
        BigInt(assetIdToSell!),
        setAppId,
      )()
    } catch (error) {
      enqueueSnackbar('Error while creating the listing', { variant: 'error' })
      setLoading(false)
      return
    }
    enqueueSnackbar('Listing created successfully', { variant: 'success' })
    setLoading(false)
  }

  return (
    <dialog id="Sell_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Create a listing</h3>
        <br />
        <input
          type="number"
          data-test-id="asset-id"
          placeholder="Enter the NFT asset ID for sale"
          className="input input-bordered w-full"
          value={assetIdToSell}
          onChange={(e) => {
            setAssetIdToSell(e.target.value)
          }}
        />
        <input
          type="number"
          data-test-id="unitary-price"
          placeholder="Enter the NFT price for sale"
          className="input input-bordered w-full"
          value={unitaryPrice}
          onChange={(e) => {
            setUnitaryPrice(e.target.value)
          }}
        />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="list-nft" className="btn" onClick={handleMethodCall}>
            {loading ? <span className="loading loading-spinner" /> : 'publish'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Sell
