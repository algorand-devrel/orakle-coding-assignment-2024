import { NftData } from '../interfaces/nft'
import { NftCard } from './NftCard'

export function NftCardSection() {
  const metadataList: NftData[] = [
    {
      name: 'AlgorandAlgorandAlgorandAlgorandAlgorandAlgorandAlgorand',
      imageUrl: 'https://findblockchaingrants.com/wp-content/uploads/2022/10/algorand-algo-logo-267E891DCB-seeklogo.com_.png',
      remainingQty: 3,
      totalQty: 10,
      price: 2.5,
    },
    {
      name: 'Algomint',
      imageUrl: 'https://pbs.twimg.com/profile_images/1391761721463697408/zTLtfP19_400x400.jpg',
      remainingQty: 0,
      totalQty: 10,
      price: 1,
    },
    {
      name: 'Silvio Micali',
      imageUrl: 'https://pbs.twimg.com/profile_images/1446051944523501569/n7Qb1XuB_400x400.jpg',
      remainingQty: 7,
      totalQty: 10,
      price: 5,
    },
    {
      name: 'John Woods',
      imageUrl: 'https://pbs.twimg.com/profile_images/1750628491433779201/7eFoDngy_400x400.jpg',
      remainingQty: 4,
      totalQty: 10,
      price: 10,
    },
    {
      name: 'Algorand Developers',
      imageUrl: 'https://pbs.twimg.com/profile_images/1638906184538238976/_0ji8Fvc_400x400.jpg',
      remainingQty: 10,
      totalQty: 10,
      price: 10,
    },
  ]

  return (
    <section className="grid grid-cols-3 gap-2">
      {metadataList.map((data) => (
        <NftCard {...data} />
      ))}
    </section>
  )
}
