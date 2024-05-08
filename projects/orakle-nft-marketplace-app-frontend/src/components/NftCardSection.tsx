import { NftMetadata } from '../interfaces/nft'
import { NftCard } from './NftCard'

export function NftCardSection() {
  const metadataList: NftMetadata[] = [
    {
      name: 'Algorand',
      description: 'We are the builders of Algorand, the high performance Layer-1 blockchain. Let us unlock the power of Algorand for you.',
      imageUrl: 'https://findblockchaingrants.com/wp-content/uploads/2022/10/algorand-algo-logo-267E891DCB-seeklogo.com_.png',
    },
    {
      name: 'Algomint',
      description: 'Bringing BTC, ETH to Algorand 🌉  http://app.algomint.io\nUSD BASKET  ➡️ https://basket.algomint.io2',
      imageUrl: 'https://pbs.twimg.com/profile_images/1391761721463697408/zTLtfP19_400x400.jpg',
    },
    {
      name: 'Silvio Micali',
      description:
        'Founder of @Algorand and co-inventor of zero-knowledge proofs. @MIT Professor. Accademia Dei Lincei. This is my only official social media account.',
      imageUrl: 'https://pbs.twimg.com/profile_images/1446051944523501569/n7Qb1XuB_400x400.jpg',
    },
    {
      name: 'John Woods',
      description: '𝗖𝗧𝗢 at @AlgoFoundation 🔗 woods.algo 🔑\nGPG/A45F8C27C80F5D4E5CE0EBD3CA8E83A64C185D8D',
      imageUrl: 'https://pbs.twimg.com/profile_images/1750628491433779201/7eFoDngy_400x400.jpg',
    },
    {
      name: 'Algorand Developers',
      description: 'Write apps for blockchain in Python, only on Algorand.',
      imageUrl: 'https://pbs.twimg.com/profile_images/1638906184538238976/_0ji8Fvc_400x400.jpg',
    },
  ]

  return (
    <section className="grid grid-cols-3 gap-2">
      {metadataList.map((metadata) => (
        <NftCard metadata={metadata} />
      ))}
    </section>
  )
}
