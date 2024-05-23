import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { algorandClientAtom, appDetailsListAtom, isSellingAtom, listClientAtom } from '../atoms'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { getAppList } from '../utils/getAppList'
import { marketplaceListAppId } from '../utils/marketplaceListAppId'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const isLocalNet = import.meta.env.VITE_ALGOD_NETWORK === ''

export function useMarketPlace() {
  const { activeAddress, signer, clients } = useWallet()
  const [algorandClient, setAlgorandClient] = useAtom(algorandClientAtom)
  const [listClient, setListClient] = useAtom(listClientAtom)
  const setAppDetailsList = useSetAtom(appDetailsListAtom)
  const setIsSelling = useSetAtom(isSellingAtom)
  const [health, setHealth] = useState(!isLocalNet)

  useEffect(() => {
    let healthInterval: NodeJS.Timeout

    if (!health && isLocalNet) {
      healthInterval = setInterval(async () => {
        setHealth((await clients?.kmd?.healthCheck()) !== undefined)
      }, 500)
    }

    return () => {
      healthInterval && clearInterval(healthInterval)
    }
  }, [clients?.kmd, isLocalNet])

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
          id: marketplaceListAppId,
          sender: { addr: activeAddress, signer },
        },
        algorandClient.client.algod,
      )
      setListClient(listClient)
    }
  }, [activeAddress, algorandClient])

  useEffect(() => {
    if (activeAddress && algorandClient && listClient) {
      getAppList(algorandClient, listClient, activeAddress, signer).then((appList) => {
        setAppDetailsList(appList)
        const isUserSelling = appList.some((app) => app.creator === activeAddress)
        setIsSelling(isUserSelling)
      })
    }
  }, [algorandClient, listClient, activeAddress])
}
