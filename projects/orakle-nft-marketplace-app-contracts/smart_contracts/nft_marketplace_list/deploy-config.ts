import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceListClient } from '../artifacts/nft_marketplace_list/client'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying NftMarketplaceList ===')

  // 여러 클라이언트 생성
  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const algorand = algokit.AlgorandClient.defaultLocalNet()
  algorand.setDefaultValidityWindow(1000)

  // 랜덤 계정 생성 후 자금 지급
  const deployer = await algorand.account.random()
  const buyer = await algorand.account.random()
  const lateBuyer = await algorand.account.random()
  const accounts = [deployer, buyer, lateBuyer]

  const dispenser = await algorand.account.dispenser()
  for (let i = 0; i < accounts.length; i++) {
    await algorand.send.payment(
      {
        sender: dispenser.addr,
        receiver: accounts[i].addr,
        amount: algokit.algos(100),
      },
      { suppressLog: true },
    )
  }

  const appClient = new NftMarketplaceListClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod,
  )

  const app = await appClient.create.bare()

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: app.appAddress,
    amount: algokit.algos(0.2),
  })

  // let result = await appClient.addMarketplaceToList({ appId: 123 })
  // console.log(result.return)

  // result = await appClient.addMarketplaceToList({ appId: 323 })
  // console.log(result.return)

  // result = await appClient.addMarketplaceToList({ appId: 344 })
  // console.log(result.return)

  // const read_result = await appClient.readMarketplaceList({})
  // console.log(read_result.return)
}
