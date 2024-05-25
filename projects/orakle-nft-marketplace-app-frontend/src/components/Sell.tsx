import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { algorandClientAtom, assetHoldingAtom, listClientAtom } from '../atoms'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import * as methods from '../methods'

interface SellInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Sell = ({ openModal, setModalState }: SellInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [assetIdToSell, setAssetIdToSell] = useState<string>('')
  const [unitaryPrice, setUnitaryPrice] = useState<string>('')
  const [quantityForSale, setQuantityForSale] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress, clients, activeAccount } = useWallet()
  const algorandClient = useAtomValue(algorandClientAtom)
  const listClient = useAtomValue(listClientAtom)
  const assetHolding = useAtomValue(assetHoldingAtom)

  const handleMethodCall = async () => {
    setLoading(true)

    if (!signer || !activeAddress || !clients || !activeAccount) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(false)
      return
    }

    if (!algorandClient || !listClient) {
      enqueueSnackbar('AlgorandClient or ListClient not found', { variant: 'error' })
      setLoading(false)
      return
    }

    const nftmClient = new NftMarketplaceClient(
      {
        resolveBy: 'id',
        id: 0,
        sender: { addr: activeAddress!, signer },
      },
      algorandClient?.client.algod,
    )

    try {
      await methods.create(
        algorandClient,
        nftmClient,
        listClient,
        activeAddress,
        BigInt(unitaryPrice!) * BigInt(1e6),
        BigInt(quantityForSale!),
        BigInt(assetIdToSell!),
      )()
    } catch (error) {
      enqueueSnackbar('Error while creating the listing', { variant: 'error' })
      setLoading(false)
      return
    }
    enqueueSnackbar('Listing created successfully', { variant: 'success' })
    setLoading(false)
    window.location.reload()
  }

  return (
    <dialog id="Sell_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Create a listing</h3>
        <br />
        <div className="flex items-center mb-3">
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn w-full">
              Select NFT to sell
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              {assetHolding.map((number, index) => (
                <li key={index}>
                  <a onClick={() => setAssetIdToSell(String(number))}>{`Asset ID: ${number}`}</a>
                </li>
              ))}
            </ul>
          </div>
          <input
            type="number"
            data-test-id="asset-id"
            placeholder="NFT to be sold"
            className="input input-bordered w-full"
            value={assetIdToSell}
            readOnly
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="asset-id" className=" mb-1 font-semibold">
            How many NFTs do you want to list for sale?
          </label>
          <input
            type="number"
            data-test-id="quantity-for-sale"
            placeholder="0"
            className="input input-bordered w-full"
            value={quantityForSale}
            onChange={(e) => {
              setQuantityForSale(e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="asset-id" className=" mb-1 font-semibold">
            Your Price:
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="number"
              data-test-id="unitary-price"
              placeholder="0"
              className="grow"
              value={unitaryPrice}
              onChange={(e) => {
                setUnitaryPrice(e.target.value)
              }}
            />
            <span className="badge badge-default">ALGO</span>
          </label>
        </div>
        <h4 className="font-bold mt-4">
          <span className="text-yellow-500">⚠️</span> You need to sign 2 transactions
        </h4>
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="list-nft" className="btn btn-primary" onClick={handleMethodCall}>
            {loading ? <span className="loading loading-spinner" /> : 'publish'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Sell
