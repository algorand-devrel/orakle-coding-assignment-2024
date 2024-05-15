import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import { algorandObject } from '../interfaces/algorandObject'
import { appDetails } from '../interfaces/appDetails'
import { getAppList } from '../utils/getAppList'
import { NftCard } from './NftCard'

interface NftCardSectionProps {
  algorandObject: algorandObject
  appDetailsList: appDetails[]
  setIsSelling: (isSelling: boolean) => void
  setAppDetailsList: (appDetailsList: appDetails[]) => void
}

export function NftCardSection({ algorandObject, appDetailsList, setAppDetailsList, setIsSelling }: NftCardSectionProps) {
  const { activeAddress, signer, clients } = useWallet()
  const [health, setHealth] = useState(false)

  useEffect(() => {
    const healthInterval = setInterval(async () => {
      setHealth((await clients?.kmd?.healthCheck()) !== undefined)
    }, 500)

    return () => {
      clearInterval(healthInterval)
    }
  }, [clients?.kmd])

  useEffect(() => {
    if (signer && activeAddress && health) {
      getAppList(algorandObject, activeAddress!, signer).then((appList) => {
        for (const appDetails of appList!) {
          if (appDetails.creator == activeAddress) {
            setIsSelling(true)
            break
          }
        }
        setAppDetailsList(appList!)
      })
    }
  }, [health, activeAddress])

  return (
    <section className="grid grid-cols-3 gap-2">
      {appDetailsList.map((data) => (
        <NftCard {...data} algorandObject={algorandObject} />
      ))}
    </section>
  )
}
