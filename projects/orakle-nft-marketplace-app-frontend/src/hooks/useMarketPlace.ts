import { useEffect, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { algorandClientAtom, appDetailsListAtom, isSellingAtom, listClientAtom } from '../atoms'
import { getAppList } from '../utils/getAppList'

export function useMarketPlace() {
  const { activeAddress, signer, clients } = useWallet()
  const [algorandClient, setAlgorandClient] = useAtom(algorandClientAtom)
  const [listClient, setListClient] = useAtom(listClientAtom)
  const setAppDetailsList = useSetAtom(appDetailsListAtom)
  const setIsSelling = useSetAtom(isSellingAtom)
  const [health, setHealth] = useState(false)

  useEffect(() => {
    let healthInterval: NodeJS.Timeout

    if (!health) {
      healthInterval = setInterval(async () => {
        setHealth((await clients?.kmd?.healthCheck()) !== undefined)
      }, 500)
    }

    return () => {
      healthInterval && clearInterval(healthInterval)
    }
  }, [clients?.kmd])

  useEffect(() => {
    if (health && activeAddress) {
      const algodConfig = getAlgodConfigFromViteEnvironment()
      const algorandClient = AlgorandClient.fromConfig({ algodConfig })
      algorandClient.setDefaultSigner(signer)
      setAlgorandClient(algorandClient)
    }
  }, [health, activeAddress])

  useEffect(() => {
    if (activeAddress && algorandClient) {
      const listClient = new NftMarketplaceListClient(
        {
          resolveBy: 'id',
          id: 1047, // Update this ID as needed
          sender: { addr: activeAddress, signer },
        },
        algorandClient.client.algod,
      )
      setListClient(listClient)
    }
  }, [activeAddress, algorandClient])

  useEffect(() => {
    if (activeAddress && algorandClient && listClient) {
      getAppList({ algorand: algorandClient, listClient }, activeAddress, signer).then((appList) => {
        setAppDetailsList(appList)
        const isUserSelling = appList.some((app) => app.creator === activeAddress)
        setIsSelling(isUserSelling)
      })
    }
  }, [algorandClient, listClient, activeAddress])
}
