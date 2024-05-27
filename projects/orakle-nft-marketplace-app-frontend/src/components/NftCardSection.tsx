import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { appDetailsListAtom, healthAtom } from '../atoms'
import { NftCard } from './NftCard'

export function NftCardSection() {
  const appDetailsList = useAtomValue(appDetailsListAtom)
  const healthExternal = useAtomValue(healthAtom)
  const { activeAddress } = useWallet()

  const loadingList: number[] = [...Array(9).keys()]

  return (
    <section>
      {activeAddress ? (
        healthExternal ? (
          appDetailsList.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
              {appDetailsList.map((data) => (
                <NftCard key={data.assetId} {...data} />
              ))}
            </div>
          ) : (
            <h1 className="text-center">No NFTs available</h1>
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
            {loadingList.map((data) => (
              <div className="skeleton w-80 h-96" key={data}></div>
            ))}
          </div>
        )
      ) : (
        <h1 className="text-center">
          Welcome to Algorand X Orakle NFT Marketplace! <br /> Please connect Your Wallet to continue
        </h1>
      )}
    </section>
  )
}
