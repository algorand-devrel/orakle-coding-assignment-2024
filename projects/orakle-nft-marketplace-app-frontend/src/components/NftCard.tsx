import { useState } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import Buy from './Buy'

interface NftCardProps {
  appId: bigint
  unitaryPrice: bigint
  assetId: bigint
  assetName: string
  imageUrl: string
  remainingQty: bigint
  creator: string
}

export function NftCard({ appId, unitaryPrice, assetName, imageUrl, remainingQty, creator }: NftCardProps) {
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="card w-80 bg-base-100 shadow-xl">
        <figure>
          <img className="w-full aspect-square" src={imageUrl} alt="nft image" />
        </figure>
        <div className="card-body flex-row py-7 px-6">
          <div className="w-full">
            <h2 className="card-title">{assetName}</h2>
            <p className="font-thin text-sm">Creator: {ellipseAddress(creator)}</p>
            <span className="font-thin text-sm">Remaining: {Number(remainingQty)} left</span>
            <p className="font-thin text-sm">Price: {(unitaryPrice / BigInt(1e6)).toLocaleString(undefined)} ALGO</p>
          </div>
          <div className="card-actions justify-end items-end">
            <button className="btn btn-primary disabled:btn-disabled" onClick={toggleModal} disabled={remainingQty === 0n}>
              {remainingQty === 0n ? 'SOLD OUT!' : 'Buy now'}
            </button>
          </div>
        </div>
      </div>
      <Buy openModal={openModal} setModalState={setOpenModal} currentAppId={appId} unitaryPrice={unitaryPrice} />
    </>
  )
}
