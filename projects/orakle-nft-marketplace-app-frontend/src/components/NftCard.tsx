import { useState } from 'react'
import { algorandObject } from '../interfaces/algorandObject'
import Buy from './Buy'

// interface appDetails {
//   appId: bigint
//   unitaryPrice: bigint
//   assetId: bigint
//   assetName: string
//   imageUrl: string
//   remainingQty: bigint
//   totalQty: bigint
// }

interface NftCardProps {
  appId: bigint
  unitaryPrice: bigint
  assetId: bigint
  assetName: string
  imageUrl: string
  remainingQty: bigint
  totalQty: bigint
  algorandObject: algorandObject
}

export function NftCard({ appId, unitaryPrice, assetId, assetName, imageUrl, remainingQty, totalQty, algorandObject }: NftCardProps) {
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className="w-[300px] overflow-hidden flex flex-col items-start gap-2 bg-white rounded-xl group"
        disabled={remainingQty === 0n}
      >
        <img className="w-full aspect-square" src={imageUrl} alt="nft image" />
        <div className=" w-full flex flex-col gap-2">
          <div className="w-full px-2 flex flex-col gap-2 items-start">
            <div className="w-full flex flex-row gap-2 items-center">
              <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{assetName}</span>
              <span>
                {Number(remainingQty)}/{Number(totalQty)}
              </span>
            </div>
            <span className="font-bold">
              {(unitaryPrice / BigInt(1e6)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ALGO
            </span>
          </div>
          <div className="w-full p-2 text-white bg-teal-900 group-hover:bg-teal-100 group-disabled:bg-gray-300">Buy</div>
        </div>
      </button>
      <Buy
        openModal={openModal}
        setModalState={setOpenModal}
        currentAppId={appId}
        unitaryPrice={unitaryPrice}
        algorandObject={algorandObject}
      />
    </>
  )
}
