import { Header } from './components/Header'
import { NftCardSection } from './components/NftCardSection'
import { TransactSection } from './components/TransactSection'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <div className="min-h-screen bg-teal-400 flex flex-col items-center gap-[48px] pb-[96px]">
      <Header />
      <TransactSection />
      <NftCardSection />
    </div>
  )
}

export default Home
