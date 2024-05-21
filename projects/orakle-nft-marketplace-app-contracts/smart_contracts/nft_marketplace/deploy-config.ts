import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceClient } from '../artifacts/nft_marketplace/client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying NftMarketplaceClient ===')

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
  })

  // 앱이 판매할 준비가 되도록 Bootstrap 메서드를 호출
  await appClient.bootstrap(
    { asset: assetId, unitaryPrice: unitaryPrice, mbrPay: mbrPay },
    { sendParams: { fee: algokit.transactionFees(2), populateAppCallResources: true, suppressLog: true } },
  )
  console.log('2. 앱 부트스트래핑 완료!')

  // NftMarketplaceClient 앱에 판매할 NFT 에셋 송금
  await algorand.send.assetTransfer(
    {
      sender: deployer.addr,
      receiver: app.appAddress,
      assetId: assetId,
      amount: 100n,
    },
    { suppressLog: true },
  )
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

  const lateBuyerAppClient = new NftMarketplaceClient(
    {
      resolveBy: 'id',
      sender: lateBuyer,
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
    try {
      let assetInfo = await algorand.account.getAssetInformation(buyer, assetId)
      console.log(`${buyerName}가 이미 에셋에 옵트인 되어있어요! 현재 보유한 티켓 수: ${assetInfo.balance}개`)
    } catch (e) {
      console.log(`${buyerName}가 에셋에 옵트인이 안 되어있어요. 옵트인 진행할게요~`)
      // 구매자가 NFT에 옵트인
      await algorand.send.assetOptIn(
        {
          sender: buyer.addr,
          assetId: assetId,
        },
        { suppressLog: true },
      )
    }

    // NftMarketplaceClient buy 메서드 호출때 구매 비용 지불로 사용할 결제 트랜잭션 생성
    const buyNftPay = await algorand.transactions.payment({
      sender: buyer.addr,
      receiver: appAddr,
      amount: algokit.algos((unitaryPrice * buyAmount) / 1_000_000),
    })

    // 위 결제 트랜잭션과 NftMarketplaceClient buy 메서드를 어토믹 트랜잭션으로 동시에 호출
    await appClient.buy(
      {
        buyerTxn: buyNftPay,
        quantity: buyAmount,
      },
      { sendParams: { fee: algokit.transactionFees(2), populateAppCallResources: true, suppressLog: true } },
    )

    const assetInfo = await algorand.account.getAssetInformation(buyer, assetId)
    console.log(`${buyerName}가 티켓 1장을 추가 구매하여 ${assetInfo.balance}개의 티켓을 보유하고 있어요!`)
  }

  await buyAsset(buyerAppClient, 'buyer', buyer, assetId, 1, app.appAddress, unitaryPrice)

  // // 아이유 콘서트가 인기가 너무 많아서 가격을 올림
  // await appClient.setPrice({
  //   unitaryPrice: unitaryPrice * 2,
  // })
  // console.log('4. IU 티켓 가격 2배로 올림!')

  // unitaryPrice = unitaryPrice * 2

  // // Buyer가 친구도 데리고 가고 싶어서 1개의 티켓을 추가 구매
  // await buyAsset(buyerAppClient, 'buyer', buyer, assetId, 1, app.appAddress, unitaryPrice)

  // // 티켓팅에 늦은 lateBuyer가 2개의 티켓을 구매
  // await buyAsset(lateBuyerAppClient, 'lateBuyer', lateBuyer, assetId, 2, app.appAddress, unitaryPrice)

  // 판매자가 NftMarketplaceClient 앱을 삭제하며 수익금과 잔여 NFT 에셋을 회수
  const returnVal = await appClient.delete.withdrawAndDelete(
    {},
    { sendParams: { fee: algokit.transactionFees(3), populateAppCallResources: true } },
  )
  console.log(returnVal.return)
  console.log('5. IU 티켓 판매 종료 및 수익금 회수 완료!')

  /* 
  ========== 과제가 너무 쉬운 그대를 위하여... ==========
  시간은 남았는데 모든 문제를 이미 다 푸셨나요? 후후후... 그럼 이것도 한번 해보세요!

  시나리오: 방탄소년단도 이 NftMarketplace 앱을 통해 콘서트 티켓을 팔려고 합니다. 티켓 가격은 20 Algos로 팔겠다고 합니다. 
  하이브 계정이 앱을 배포하고 티켓을 앱에 보내어 판매를 합니다. 방탄소년단의 팬이 여러분의 지갑을 개설하고 그 지갑으로 티켓 1장을 사세요. 
  그때 여러분 친구1한테 연락이 와서 콘서트 같이 가자고 연락이 옵니다. 그래서 여러분이 티켓 1장을 추가로 구매하려고 보니까 가격이 30 Algos로 
  올라갔습니다. 그래서 어쩔 수 없이 30Algos로 티켓 1장을 추가로 삽니다. 근데 친구2도 같이 가자고 하네요. 그래서 친구2를 위해 티켓 1장을 
  추가로 구매하려고 하는데 가격이 40Algos로 올랐습니다. 그래서 40Algos로 티켓 1장을 추가로 삽니다. 하이브는 그 뒤 충분한 티켓을 팔았다고
  생각하여 앱을 삭제하고 수익금을 회수합니다.

  지금 푸실 문제들은 아직 배우지 않은 Application Client를 사용하여 앱을 배포하고 호출하는 코드를 작성해야하는 문제들입니다. 
  이 내용은 세션 4때 다룰 내용이지만 한번 미리 도전해보세요!
  */
  async function btsScenario(): Promise<void> {
    console.log('=== 보너스 문제: 방탄소년단 시나리오 실행 ===')

    // 방탄소년단과 팬 계정을 랜덤 생성
    const bts = await algorand.account.random()
    const fan = await algorand.account.random()
    const accounts2 = [bts, fan]

    // 계정들에 100 Algos 송금
    for (let i = 0; i < accounts2.length; i++) {
      await algorand.send.payment(
        {
          sender: dispenser.addr,
          receiver: accounts2[i].addr,
          amount: algokit.algos(100),
        },
        { suppressLog: true },
      )
    }
    /*
    문제 1
    스마트계약을 만들고 티켓을 판매할 하이브 계정과 연동된 앱 클라이언트 생성하세요.

    앱 클라이언트는 쉽고 간편하게 스마트계약을 배포 및 호출할 수 있도록 해주는 클라이언트입니다.

    힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#creating-an-application-client-instance
    */
    //
    const btsAppClient = new NftMarketplaceClient(
      {
        resolveBy: 'creatorAndName',
        findExistingUsing: indexer,
        sender: bts,
        creatorAddress: bts.addr,
      },
      algod,
    )

    /*
    문제 2
    위에 생성한 btsAppClient를 사용하여 앱을 배포하세요.

    힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#create-calls
    */
    const btsApp = await btsAppClient.create.bare()

    /*
    문제 3
    이번에는 팬 앱 클라이언트를 생성하세요. 이 앱 클라이언트는 팬의 계정과 연동되어있습니다.
    즉 이 클라이언트로 앱을 호출하면 팬 계정으로 호출하게 됩니다.

    주의사항: 이번에는 위에 판매자 앱 클라이언트랑은 다르게 이미 배포되어있는 앱의 클라이언트를 생성해야 합니다.

    힌트: resolveBy를 'creatorAndName'말고 다른거로 바꿔보세요.
    https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#creating-an-application-client-instance
    */
    //
    const fanAppClient = new NftMarketplaceClient(
      {
        resolveBy: 'id',
        sender: fan,
        id: btsApp.appId,
      },
      algod,
    )

    // 판매할 방탄소년단 콘서트 티켓 에셋 10장 생성
    const createResult = await algorand.send.assetCreate(
      {
        sender: bts.addr,
        assetName: 'BTS Concert Ticket',
        unitName: 'BTS',
        total: 10n,
      },
      { suppressLog: true },
    )

    // 생성된 에셋 ID를 저장
    const assetId = BigInt(createResult.confirmation.assetIndex!)

    // 티켓 가격 20 Algos로 설정 이때 스마트계약은 microAlgos로 이해하기 때문에 1_000_000을 곱해줍니다.
    let unitaryPrice: number = 20 * 1_000_000

    /*
    문제 4
    앱이 판매할 준비가 되도록 Bootstrap 메서드를 호출하세요.

    부트스트랩 메서드는 앱이 필요한 미니멈 밸런스를 지급하고 앱이 판매할 NFT 에셋에 옵트인하는 메서드입니다.
    밑에 mbrPay라는 미니멈 밸런스를 지급하는 트랜잭션 객체를 만들어놓았습니다. 이 객체는 바로 Transaction Type입니다.
    스마트계약의 bootstrap 메서드 전달값을 다시 확인해보고 이 mbrPay를 전달값으로 넣어주세요.

    주의사항: bootstrap 메서드는 Inner Transaction이 1개 있습니다. (앱 코드 참고) 즉 이 1개의 트랜잭션 비용을
    bootstrap 메서드를 호출할때 같이 내줘야합니다. sendParams를 통해 fee를 0.002 Algos로 설정해주시고 
    populateAppCallResources를 true로 설정해줌으로써 필요한 reference들을 자동 기입해주도록 해주세요.

    힌트: 이 파일 70-74번째 줄에 있는 코드를 참고하세요.
    */

    // NftMarketplaceClient 앱에 미니멈 밸런스 지급
    const mbrPay = await algorand.transactions.payment({
      sender: bts.addr,
      receiver: btsApp.appAddress,
      amount: algokit.algos(0.2),
    })

    // bootstrap 메서드 호출해서 앱이 판매할 NFT 에셋에 옵트인
    await btsAppClient.bootstrap(
      { asset: assetId, unitaryPrice: unitaryPrice, mbrPay: mbrPay },
      { sendParams: { fee: algokit.transactionFees(2), populateAppCallResources: true, suppressLog: true } },
    )
    const appGlobalState = await btsAppClient.getGlobalState()
    if (appGlobalState.bootstrapped?.asNumber()) {
      console.log('방탄소년단 앱이 준비 완료되었습니다!')
    } else {
      console.log('방탄소년단 앱이 준비에 실패했습니다. 다시 확인해주세요!')
      return
    }

    // NftMarketplaceClient 앱에 판매할 NFT 에셋 송금
    await algorand.send.assetTransfer(
      {
        sender: bts.addr,
        receiver: btsApp.appAddress,
        assetId: assetId,
        amount: 10n,
      },
      { suppressLog: true },
    )

    // 방탄소년단 팬이 1장의 티켓을 구매. buyAsset 함수는 라인 109번째 줄에 있습니다.
    await buyAsset(fanAppClient, 'fan', fan, assetId, 1, btsApp.appAddress, unitaryPrice)

    let assetInfo = await algorand.account.getAssetInformation(fan, assetId)
    if (assetInfo.balance === 1n) {
      console.log('팬이 성공적으로 티켓 1장을 구매했습니다!')
    } else {
      console.log('팬이 티켓 구매에 실패했습니다. 다시 확인해주세요!')
    }
    /*
    문제 5
    방탄소년단 콘서트가 인기가 너무 많아서 가격을 올릴려고 합니다. 
    setPrice 메서드를 호출해 티켓 가격을 10 Algos 올려서 30 Algos로 만들어주세요.
    그러고 난 뒤 buyAsset 함수 호출뒤 다시 한번 더 티켓 가격을 10 Algos 올려 40 Algos로 만들어주세요.

    주의사항: 10 Algos == 10_000_000 microAlgos 현재 unitaryPrice는 microAlgos로 되어있습니다.

    팁: 다른 앱 메서드 호출 방법과 동일합니다~ 
    */
    // 방탄소년단 콘서트가 인기가 너무 많아서 가격을 올림
    unitaryPrice = unitaryPrice + 10 * 1_000_000
    await btsAppClient.setPrice({
      unitaryPrice: unitaryPrice,
    })

    // 방탄소년단 팬이 친구1를 위해1장의 티켓을 추가 구매
    await buyAsset(fanAppClient, 'fan', fan, assetId, 1, btsApp.appAddress, unitaryPrice)

    assetInfo = await algorand.account.getAssetInformation(fan, assetId)
    if (assetInfo.balance === 2n) {
      console.log('팬이 성공적으로 티켓 1장을 추가 구매해 2장을 가지게 되었습니다!')
    } else {
      console.log('팬이 티켓 구매에 실패해 여전히 티켓 1장만 가지고있습니다 ㅠㅠ. 다시 확인해주세요!')
      return
    }

    // 방탄소년단 콘서트가 인기가 너무 많아서 또 가격을 올림
    unitaryPrice = unitaryPrice + 10 * 1_000_000
    await btsAppClient.setPrice({
      unitaryPrice: unitaryPrice,
    })

    // 방탄소년단 팬이 친구2를 위해1장의 티켓을 추가 구매
    await buyAsset(fanAppClient, 'fan', fan, assetId, 1, btsApp.appAddress, unitaryPrice)

    assetInfo = await algorand.account.getAssetInformation(fan, assetId)
    if (assetInfo.balance === 3n) {
      console.log('팬이 성공적으로 티켓 1장을 추가 구매해 3장을 가지게 되었습니다!')
    } else {
      console.log('팬이 티켓 구매에 실패해 여전히 티켓 2장만 가지고있습니다 ㅠㅠ. 다시 확인해주세요!')
      return
    }
    /*
    문제 6
    방탄소년단이 충분한 티켓을 팔았다고 생각합니다. 앱을 삭제하고 수익금을 회수할 수 있도록 withdrawAndDelete 메서드를 호출하세요.

    withdrawAndDelete 메서드는 OnComplete Actions가 DeleteApplication으로 설정된 특별한 메서드입니다. 
    앱 클라이언트에는 delete라는 property가 있습니다. 이 delete property에 withdrawAndDelete 메서드가 있으니 이 메서드를 호출하시면 됩니다.
    
    주의사항: withdrawAndDelete 메서드는 Inner Transaction이 두개나 있습니다. (앱 코드 참고) 즉 이 두개의 트랜잭션 비용을
    withdrawAndDelete를 호출할때 같이 내줘야합니다. sendParams를 통해 fee를 0.003 Algos로 설정해주시고 
    populateAppCallResources를 true로 설정해줌으로써 필요한 reference들을 자동 기입해주도록 해주세요.
    
    힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#update-and-delete-calls
    */

    // 판매자가 NftMarketplaceClient 앱을 삭제하며 수익금과 잔여 NFT 에셋을 회수

    let btsAccountInfo = await algorand.account.getInformation(bts)
    console.log(
      `방탄소년단 계정이 앱을 삭제하기 전에는 ${btsAccountInfo.amount / 1_000_000} Algos를 보유하고 있습니다.`,
    )

    await btsAppClient.delete.withdrawAndDelete(
      {},
      { sendParams: { fee: algokit.transactionFees(3), populateAppCallResources: true } },
    )

    btsAccountInfo = await algorand.account.getInformation(bts)
    const btsAccountBalance = btsAccountInfo.amount / 1_000_000
    if (btsAccountBalance == 189.989) {
      console.log(`방탄소년단이 성공적으로 앱을 삭제하고 수익금 90 Algos를 회수했습니다!`)
    } else {
      console.log(`방탄소년단이 앱 삭제에 실패했습니다. 현재 계정 잔액: ${btsAccountBalance} Algos`)
    }
  }

  /*
  문제 7
  보너스 문제를 푸셨다면 아래 주석을 해제하고 await btsScenario를 실행하세요!
  */
  // await btsScenario()
}
