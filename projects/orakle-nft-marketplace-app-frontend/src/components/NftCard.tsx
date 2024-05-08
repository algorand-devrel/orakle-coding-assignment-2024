import { NftMetadata } from '../interfaces/nft'

export function NftCard({ metadata }: { metadata: NftMetadata }) {
  const { name, description, imageUrl } = metadata

  return (
    <div className="w-[300px] flex flex-col items-center gap-6 p-4 bg-white rounded-xl">
      <h1 className="font-bold text-lg">{name}</h1>
      <img className="w-[200px]" src={imageUrl} alt="nft image" />
      <span className="w-full line-clamp-2">{description}</span>
    </div>
  )
}
