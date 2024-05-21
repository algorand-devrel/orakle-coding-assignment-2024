import { useAtomValue } from 'jotai'
import { NftCard } from './NftCard'
import { appDetailsListAtom } from '../atoms'

export function NftCardSection() {
  const appDetailsList = useAtomValue(appDetailsListAtom)

  return (
    <section className="grid grid-cols-3 gap-2">
      {appDetailsList.map((data) => (
        <NftCard key={data.assetId} {...data} />
      ))}
    </section>
  )
}
