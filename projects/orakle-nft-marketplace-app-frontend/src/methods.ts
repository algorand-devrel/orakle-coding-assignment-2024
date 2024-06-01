/* eslint-disable no-console */
import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { marketplaceListAppId } from './utils/marketplaceListAppId'

/*
=== 먼저 읽고 진행해주세요!! ===
methods.ts 파일은 디지털 마켓플레이스 앱을 생성하고 호출하는 여러 메서드들을 정의하는 파일입니다.
이 파일에는 3개의 함수가 정의되어 있습니다.
1. createAndListNft: src/components/Sell.tsx에서 NFT 판매 리스팅을 할때 사용.
2. buyNft: src/components/Buy.tsx에서 NFT 구매를 할때 사용.
3. deleteAppAndWithdraw: src/components/Withdraw.tsx에서 수익금을 인출 및 스마트계약 삭제할때 사용.

기억하세요!
nftmClient로 nft marketplace 스마트계약을 배포 및 호출할때는 항상 await을 사용해야합니다.

이 파일에는 문제 6부터 9까지 총 4문제가 있습니다. 아래 설명들을 자세히 읽고 문제를 풀어주세요!
*/

export function createAndListNft(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  listClient: NftMarketplaceListClient,
  sender: string,
  unitaryPrice: bigint,
  quantity: bigint,
  assetBeingSold: bigint,
) {
  return async () => {
    console.log('creating app')

    /*
    문제 6
    문제5에서 생성한 nftmClient를 사용하여 앱을 배포하세요.

    사용해야할 createAndListNft의 인수:
    - nftmClient: 문제 5에서 정의한 nft marketplace app client

    스마트계약 배포시 `deploy`가 아닌 `create` 메서드를 사용해서 배포하세요.
    `deploy`는 스마트계약이 이미 배포 되있는지 확인하고 배포 되어 있다면 다시 배포하지 않습니다. 과제를 풀때 항상 새로
    배포하는게 편하기 때문에 스크립트가 실행될때마다 배포하는 `create` 메서드를 사용해주세요.

    또한 디지털 마켓플레이스에 create 메서드를 따로 구현하지 않았기 때문에 기본적으로 제공되는 bare create 메서드를 사용하세요.

    힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#create-calls
    */
    // 문제 6 시작
    const createResult = await nftmClient.create.bare()
  
    // 문제 6 끝

    /*
    문제 7
    앱이 판매할 준비가 되도록 Bootstrap 메서드를 호출하세요.

    bootstrap 메서드는 앱이 필요한 미니멈 밸런스를 앱에게 지급하고 앱이 판매할 NFT 에셋에 옵트인하는 메서드입니다.

    사용해야할 createAndListNft의 인수:
    - assetBeingSold: 판매할 NFT 에셋의 ID
    - unitaryPrice: NFT 하나의 가격

    부트스트랩 메서드 안에는 판매할 NFT에 옵트인하는 inner transaction이 있습니다.
    따라서 부트스트랩 메서드 호출자가 inner transaction의 트랜잭션 비용을 대신 내야합니다.
    이 추가 비용은 부트스트랩 호출 시 어토믹으로 묶여서 동시체결될 mbrTxn안에 extraFee를 통해서 설정할 수 있습니다.
    이때 extraFee는 AlgoAmount 데이터타입을 받습니다!! (그냥 숫자 넣으면 에러뜸)

    알고랜드의 트랜잭션 비용은 0.001 Algos입니다.

    팁!
    Nft Markeplace 코드를 보고 bootstrap 메서드가 어떤 인수를 받는지 확인하고 진행하세요.

    힌트1: AlgoAmount 설정하는 방법: https://github.com/algorandfoundation/algokit-utils-ts/blob/e9682db133fab42627648ac2f779cd91f3e6cd21/docs/capabilities/amount.md#creating-an-algoamount
    힌트2: 앱 클라이언트로 특정 메서드 호출 방법: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#no-ops
    */

    // 문제 7 시작
    const mbrTxn = await algorand.transactions.payment({
      sender,
      receiver: createResult.appAddress,
      amount: algokit.algos(0.1 + 0.1),
      extraFee: AlgoAmount.Algos(2),
    })

      await nftmClient.bootstrap
      ({
        asset: assetBeingSold,
        unitaryPrice: unitaryPrice,
        mbrPay: mbrTxn,
      })
    
    // 문제 7 끝

    const sendAssetToSell = {
      assetId: assetBeingSold,
      sender,
      receiver: createResult.appAddress,
      amount: quantity,
    }

    await algorand
      .newGroup()
      .addAssetTransfer(sendAssetToSell)
      .addMethodCall({
        sender: sender,
        appId: BigInt(marketplaceListAppId),
        method: listClient.appClient.getABIMethod('add_marketplace_to_list')!,
        args: [createResult.appId],
      })
      .execute()
  }
}

export function buyNft(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  sender: string,
  assetId: bigint,
  appAddress: string,
  quantity: bigint,
  unitaryPrice: bigint,
) {
  return async () => {
    /*
    문제 8
    아래 3개의 트랜잭션을 어토믹 그룹으로 묶어서 실행하는 코드를 구현하세요.
      1. assetOptInTxn(라인 157): 구매자가 구매할 NFT에 optin하는 트랜잭션
      2. buyerTxn(라인 144): buy 메서드 호출 시 구매를 위해 Algo를 앱계정으로 송금하는 트랜잭션
      3. buy 메서드 호출 트랜잭션

    알고랜드에서는 계정이 특정 ASA에 optin을 해야지만 그 ASA를 받고 보유할 수 있습니다. 따라서 이 파일의 buyNft 함수는 먼저
    구매자가 구매할 NFT에 optin을 했는지 체크합니다.
    - optin이 되어 있으면 바로 스마트계약의 buy 메서드를 호출
    - optin을 안했다면 먼저 optin을 하고 buy 메서드를 호출

    여러분은 optin을 하고 buy 메서드를 어토믹으로 동시에 호출하는 코드를 작성하셔야 합니다.

    사용해야할 buyNft의 인수:
    - nftmClient: 문제 5에서 정의한 nft marketplace app client
    - quantity: 구매할 NFT의 수량

    밑에 buyerTxn과 assetOptInTxn이라는 두개의 트래잭션 객체가 정의되어있습니다. 이 두 트랜잭션을 스마트계약의 buy 메서드와 어토믹 그룹으로 묶어서 실행하셔야합니다.
    - buyerTxn: 구매자가 구매할 NFT에 대한 지불을 하는 트랜잭션입니다.
    - assetOptInTxn: 구매자가 구매할 NFT에 optin을 하는 트랜잭션입니다.

    여기서 buyerTxn은 buy 메서드의 인수로 들어가기 때문에 자동으로 어토믹 그룹에 포함됩니다. 따라서 assetOptInTxn만 따로 어토믹 그룹에 추가해주시면 됩니다.
    어토믹그룹을 형성하고 execute하는것을 까먹지 마세요!

    힌트1: fluent Atomic Composer로 어토믹 그룹을 형성, 트랜잭션 추가, 제출하는법: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#using-the-fluent-composer:~:text=await%20client.compose()%0A%20%20.methodOne(%7B%20arg1%3A%20123%20%7D%2C%20%7B%20boxes%3A%20%5B%27V%27%5D%20%7D)%0A%20%20//%20Non%2DABI%20transactions%20can%20still%20be%20added%20to%20the%20group%0A%20%20.addTransaction(fundingTransaction)%0A%20%20.methodTwo(%7B%20arg1%3A%20%27foo%27%20%7D)%0A%20%20.execute()
    힌트2: 앱 클라이언트로 특정 메서드 호출 방법: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#no-ops
    */

    const buyerTxn = await algorand.transactions.payment({
      sender,
      receiver: appAddress,
      amount: algokit.microAlgos(Number(quantity * unitaryPrice)),
      extraFee: algokit.algos(0.001),
    })

    try {
      const assetInfo = await algorand.account.getAssetInformation(sender, assetId)
      console.log(`${sender}가 이미 에셋에 옵트인 되어있어요! 현재 보유한 티켓 수: ${assetInfo.balance}개`)
    } catch (e) {
      console.log(`${sender}가 에셋에 옵트인이 안 되어있어요. 옵트인 진행할게요~`)

      const assetOptInTxn = await algorand.transactions.assetOptIn({
        sender,
        assetId,
      })
      // 문제 8 시작
      const result = await nftmClient.compose().addTransaction(assetOptInTxn).buy({buyerTxn, quantity}).execute()
      // 문제 8 끝

      console.log(`${sender}가 에셋에 옵트인하고 구매했어요!`)
      return
    }

    await nftmClient.buy({
      buyerTxn,
      quantity,
    })
    console.log('buy done')
  }
}

export function deleteAppAndWithdraw(nftmClient: NftMarketplaceClient, listClient: NftMarketplaceListClient, appId: number) {
  return async () => {
    console.log('deleting app')

    /*
    문제 9
    앱을 삭제하고 수익금과 잔여 NFT를 회수하는 withdrawAndDelete 메서드를 호출하세요.

    withdrawAndDelete 메서드는 OnComplete Actions가 DeleteApplication으로 설정된 특별한 메서드입니다.
    nftmClient에는 delete라는 property가 있습니다. 이 delete property 안에 withdrawAndDelete 메서드가 있으니 이 메서드를 호출하시면 됩니다.

    앱 클라이언트로 withdrawAndDelete 같은 메서드를 호출할때 전달값을 두개 넣을 수 있습니다.
    1. ABI Arguments: 스마트계약 메서드 호출시 전달값을 넣는 곳입니다.
    2. Additional Parameters: 앱 클라이언트 메서드 호출시 추가적인 설정을 넣는 곳입니다.

    abi argument:
    withdrawAndDelete는 전닯값이 필요없는 메서드입니다. 따라서 빈 객체를 넣어주세요.

    additional parameters:
    withdrawAndDelete는 2개의 inner txn를 보냅니다.
      1. 수익금을 판매자에게 송금
      2. 잔여 nft를 판매자에게 송금
    따라서 2개의 트랜잭션 비용을 메서드 호출자가 대신 내야함으로 sendParams 안에 추가 fee 설정을 해야합니다.
    - fee: sendParams 객체 안에 fee를 algokit.algos(0.003)로 설정하세요.

    힌트1: 앱클라이언트로 앱을 delete 하는법 - https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#update-and-delete-calls
    힌트2: 앱 클라이언트 메서드 호출때 메서드 전달값 넣는법: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#abi-arguments
    힌트3: additional parameters에 extra fee 설정하는 방법: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#additional-parameters
    힌트4: AlgoAmount 설정하는 방법: https://github.com/algorandfoundation/algokit-utils-ts/blob/e9682db133fab42627648ac2f779cd91f3e6cd21/docs/capabilities/amount.md#creating-an-algoamount
    힌트5: 다 시도해보고 모르겠을때 보세요!: https://github.com/algorand-devrel/blockchain-valley-session-2/blob/df789308e76a5a6cb3c815b256779fb197add8fd/projects/coding-assignment/smart_contracts/digital_marketplace/deploy-config.ts#L392
    */

    // 문제 9 시작
    await nftmClient.delete.withdrawAndDelete({}, { sendParams: { fee: algokit.algos(0.003) } })
    // 문제 9 끝

    await listClient.removeMarketplaceFromList({ appId: BigInt(appId) })
  }
}
