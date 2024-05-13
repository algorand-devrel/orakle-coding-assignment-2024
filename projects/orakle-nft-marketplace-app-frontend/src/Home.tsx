import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

import { useState } from 'react'
import { Header } from './components/Header'
import { NftCardSection } from './components/NftCardSection'
import { appDetails } from './interfaces/appDetails'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true })
  const [appId, setAppId] = useState<number>(0)
  const [isSelling, setIsSelling] = useState<boolean>(false)
  const [appDetailsList, setAppDetailsList] = useState<appDetails[]>([])
  const { activeAddress, signer } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(signer)

  const nftmClient = new NftMarketplaceClient(
    {
      resolveBy: 'id',
      id: appId,
      sender: { addr: activeAddress!, signer },
    },
    algorand.client.algod,
  )

  const listClient = new NftMarketplaceListClient(
    {
      resolveBy: 'id',
      id: 4211, // marketplace contract list app id. 테스트넷으로 넘어갈때 수정 필요
      sender: { addr: activeAddress!, signer },
    },
    algorand.client.algod,
  )

  const algorandObject = {
    algorand: algorand,
    nftmClient: nftmClient,
    listClient: listClient,
    appId: appId,
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-[48px] pb-[96px] bg-gradient-to-b from-teal-900 to-teal-100">
      <Header algorandObject={algorandObject} setAppId={setAppId} appDetailsList={appDetailsList} isSelling={isSelling} />
      <NftCardSection
        algorandObject={algorandObject}
        appDetailsList={appDetailsList}
        setAppDetailsList={setAppDetailsList}
        setIsSelling={setIsSelling}
      />
    </div>
  )
}

export default Home
