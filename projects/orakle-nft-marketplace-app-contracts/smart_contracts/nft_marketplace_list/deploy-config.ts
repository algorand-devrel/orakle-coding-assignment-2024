import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceListClient } from '../artifacts/nft_marketplace_list/client'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying NftMarketplaceList ===')

  // 여러 클라이언트 생성
  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const algorand = algokit.AlgorandClient.testNet()
  algorand.setDefaultValidityWindow(1000)

  // 랜덤 계정 생성 후 자금 지급
  // const deployer = await algorand.account.random()
  const deployer = await algorand.account.fromMnemonic(process.env.MY_ACCOUNT_MNEMONIC!, process.env.MY_ACCOUNT_SENDER!)

  // const dispenser = await algorand.account.dispenser()
  // await algorand.send.payment(
  //   {
  //     sender: dispenser.addr,
  //     receiver: deployer.addr,
  //     amount: algokit.algos(100),
  //   },
  //   { suppressLog: true },
  // )

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
    sender: deployer.addr,
    receiver: app.appAddress,
    amount: algokit.algos(0.2),
  })

  // let result = await appClient.addMarketplaceToList({ appId: 123 })
  // console.log(result.return)

  // result = await appClient.addMarketplaceToList({ appId: 323 })
  // console.log(result.return)

  // result = await appClient.addMarketplaceToList({ appId: 344 })
  // console.log(result.return)

  // result = await appClient.removeMarketplaceFromList({ appId: 344 })
  // console.log(result.return)

  // const read_result = await appClient.readMarketplaceList({})
  // console.log(read_result.return)
}
