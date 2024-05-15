import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

import { useState } from 'react'
import { Header } from './components/Header'
import { NftCardSection } from './components/NftCardSection'
import { appDetails } from './interfaces/appDetails'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true })
  const [isSelling, setIsSelling] = useState<boolean>(false)
  const [appDetailsList, setAppDetailsList] = useState<appDetails[]>([])
  const { activeAddress, signer } = useWallet()
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(signer)

  const listClient = new NftMarketplaceListClient(
    {
      resolveBy: 'id',
      id: 4211, // marketplace contract list app id. 테스트넷으로 넘어갈때 수정 필요. 로컬에서 테스트 할땐 재배포한 후 앱 아이디 넣고 개발 테스트 진행 필요
      sender: { addr: activeAddress!, signer },
    },
    algorand.client.algod,
  )

  const algorandObject = {
    algorand: algorand,
    listClient: listClient,
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-[48px] pb-[96px] bg-gradient-to-b from-teal-900 to-teal-100">
      <Header algorandObject={algorandObject} appDetailsList={appDetailsList} isSelling={isSelling} />
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
