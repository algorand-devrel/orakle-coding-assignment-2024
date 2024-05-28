import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceClient } from '../artifacts/nft_marketplace/client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying NftMarketplaceClient ===')
  AlgokitConfig.configure({ populateAppCallResources: true })

  // 여러 클라이언트 생성
  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const algorand = algokit.AlgorandClient.defaultLocalNet()
  algorand.setDefaultValidityWindow(1000)

  // 랜덤 계정 생성 후 자금 지급
  const deployer = await algorand.account.random()
  const buyer = await algorand.account.random()
  const accounts = [deployer, buyer]

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

  // NftMarketplace 앱 클라이언트 생성
  const appClient = new NftMarketplaceClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod,
  )

  // 판매할 아이유님 콘서트 티켓 에셋 생성 (아이유 짱❤️)
  const createResult = await algorand.send.assetCreate(
    {
      sender: deployer.addr,
      assetName: 'IU Concert Ticket',
      unitName: 'IU',
      total: 100n,
    },
    { suppressLog: true },
  )

  // 생성된 에셋 ID를 저장
  const assetId = BigInt(createResult.confirmation.assetIndex!)
  console.log(`1. IU Concert Ticket 에셋 생성 완료! 에셋 아이디: ${assetId}`)

  // NftMarketplaceClient 앱 배포
  let unitaryPrice: number = 1 * 1_000_000
  const app = await appClient.create.bare()

  // NftMarketplaceClient 앱에 미니멈 밸런스 지급
  const mbrPay = await algorand.transactions.payment({
    sender: deployer.addr,
    receiver: app.appAddress,
    amount: algokit.algos(0.2),
    extraFee: algokit.algos(0.001),
  })

  const sendAssetToSell = {
    sender: deployer.addr,
    receiver: app.appAddress,
    assetId: assetId,
    amount: 100n,
  }

  // 앱이 판매할 준비가 되도록 Bootstrap 메서드를 호출, NftMarketplaceClient 앱에 판매할 NFT 에셋 송금
  await algorand
    .newGroup()
    .addMethodCall({
      sender: deployer.addr,
      appId: BigInt(app.appId),
      method: appClient.appClient.getABIMethod('bootstrap')!,
      args: [assetId, unitaryPrice, mbrPay],
    })
    .addAssetTransfer(sendAssetToSell)
    .execute()

  console.log('2. 앱 부트스트래핑 완료!')
  console.log('3. IU 티켓 에셋 앱으로 송금 완료!')

  // 구매자 앱 클라이언트 생성. 이 앱 클라이언트는 구매자 계정과 연동됨.
  const buyerAppClient = new NftMarketplaceClient(
    {
      resolveBy: 'id',
      sender: buyer,
      id: app.appId,
    },
    algod,
  )

  // 구매자가 에섯에 옵트인하고 buy 메서드를 호출하는 함수
  async function buyAsset(
    appClient: NftMarketplaceClient,
    buyerName: string,
    buyer: TransactionSignerAccount,
    assetId: bigint,
    buyAmount: number,
    appAddr: string,
    unitaryPrice: number,
  ): Promise<void> {
    // NftMarketplaceClient buy 메서드 호출때 구매 비용 지불로 사용할 결제 트랜잭션 생성
    const buyNftPay = await algorand.transactions.payment({
      sender: buyer.addr,
      receiver: appAddr,
      amount: algokit.algos((unitaryPrice * buyAmount) / 1_000_000),
    })

    try {
      let assetInfo = await algorand.account.getAssetInformation(buyer, assetId)
      console.log(`${buyerName}가 이미 에셋에 옵트인 되어있어요! 현재 보유한 티켓 수: ${assetInfo.balance}개`)
    } catch (e) {
      console.log(`${buyerName}가 에셋에 옵트인이 안 되어있어요. 옵트인 진행할게요~`)

      // buy메서드 앱 호출 트랜잭션 생성
      const buyAppCall = await appClient
        .compose()
        .buy(
          {
            buyerTxn: buyNftPay,
            quantity: buyAmount,
          },
          { sendParams: { fee: algokit.transactionFees(2), suppressLog: true } },
        )
        .atc()

      // 구매자가 NFT에 옵트인, buyNftPay 결제 트랜잭션, NftMarketplaceClient buy 메서드를 어토믹 트랜잭션으로 동시에 호출
      await algorand
        .newGroup()
        .addAssetOptIn({
          sender: buyer.addr,
          assetId: assetId,
        })
        .addAtc(buyAppCall)
        .execute()

      const assetInfo = await algorand.account.getAssetInformation(buyer, assetId)
      console.log(`${buyerName}가 티켓 ${buyAmount}장을 구매하여 ${assetInfo.balance}개의 티켓을 보유하고 있어요!`)
      return
    }

    // 계정이 이미 구매할 에셋(아이유 콘서트 티켓)에 옵트인 되어 있을 시 buy 메서드만 호출
    await appClient.buy(
      {
        buyerTxn: buyNftPay,
        quantity: buyAmount,
      },
      { sendParams: { fee: algokit.transactionFees(2), suppressLog: true } },
    )

    const assetInfo = await algorand.account.getAssetInformation(buyer, assetId)
    console.log(`${buyerName}가 티켓 ${buyAmount}장을 구매하여 ${assetInfo.balance}개의 티켓을 보유하고 있어요!`)
  }

  await buyAsset(buyerAppClient, 'buyer', buyer, assetId, 1, app.appAddress, unitaryPrice)
  await buyAsset(buyerAppClient, 'buyer', buyer, assetId, 2, app.appAddress, unitaryPrice)

  // 판매자가 NftMarketplaceClient 앱을 삭제하며 수익금과 잔여 NFT 에셋을 회수
  await appClient.delete.withdrawAndDelete(
    {},
    { sendParams: { fee: algokit.transactionFees(3), populateAppCallResources: true } },
  )
  console.log('4. IU 티켓 판매 종료 및 수익금 회수 완료!')
}
