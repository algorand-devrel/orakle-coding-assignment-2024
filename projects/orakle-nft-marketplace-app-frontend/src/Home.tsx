import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import { Header } from './components/Header'
import { NftCardSection } from './components/NftCardSection'
import { useMarketPlace } from './hooks/useMarketPlace'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true })

  useMarketPlace()

  return (
    <div className="min-h-screen flex flex-col items-center gap-[48px] pb-[96px] bg-base-100">
      <Header />
      <NftCardSection />
    </div>
  )
}

export default Home
