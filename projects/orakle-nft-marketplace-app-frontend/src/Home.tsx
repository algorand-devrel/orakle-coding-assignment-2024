import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

import { useState } from 'react'
import { Header } from './components/Header'
import { NftCardSection } from './components/NftCardSection'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true })
  const [appId, setAppId] = useState<number>(0)
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
      id: 3959,
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
      <Header algorandObject={algorandObject} setAppId={setAppId} />
      <NftCardSection algorandObject={algorandObject} />
    </div>
  )
}

export default Home
