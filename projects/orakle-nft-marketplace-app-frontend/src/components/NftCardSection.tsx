import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { NftData } from '../interfaces/nft'
import { NftCard } from './NftCard'

interface appDetails {
  appId: bigint
  unitaryPrice: bigint
  assetId: bigint
  assetName: string
  imageUrl: string
  remainingQty: bigint
  totalQty: bigint
}

interface NftCardSectionProps {
  algorandObject: {
    algorand: AlgorandClient
    nftmClient: NftMarketplaceClient
    listClient: NftMarketplaceListClient
  }
}

export function NftCardSection({ algorandObject }: NftCardSectionProps) {
  const [appList, setAppList] = useState<bigint[]>([])
  const [appDetailsList, setAppDetailsList] = useState<appDetails[]>([])
  const { activeAddress, signer } = useWallet()

  useEffect(() => {
    let appList: bigint[] = []
    algorandObject.listClient.readMarketplaceList({}).then((list) => {
      appList = list.return!
      // setAppList(list.return!)
      console.log('appList', list.return!)
    })

    for (const appId of appList) {
      console.log('test1')
      const nftmClient = new NftMarketplaceClient(
        {
          resolveBy: 'id',
          id: Number(appId),
          sender: { addr: activeAddress!, signer },
        },
        algorandObject.algorand.client.algod,
      )

      const appDetails: appDetails = {
        appId: appId,
        unitaryPrice: 0n,
        assetId: 0n,
        assetName: '',
        imageUrl: '',
        remainingQty: 0n,
        totalQty: 0n,
      }
      nftmClient.getGlobalState().then((globalState) => {
        appDetails.unitaryPrice = globalState.unitaryPrice?.asBigInt() || 0n
        console.log('test1')
        const assetId = globalState.assetId?.asBigInt() || 0n
        appDetails.assetId = assetId
        algorandObject.algorand.account.getAssetInformation(algosdk.getApplicationAddress(appId), assetId).then((info) => {
          appDetails.remainingQty = info.balance
          algorandObject.algorand.client.algod
            .getAssetByID(Number(assetId))
            .do()
            .then((asset) => {
              console.log('asset', asset)
            })
        })
      })
      setAppDetailsList((prev) => [...prev, appDetails])
    }
  })

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
      {appDetailsList.map((data) => (
        <NftCard {...data} />
      ))}
    </section>
  )
}
