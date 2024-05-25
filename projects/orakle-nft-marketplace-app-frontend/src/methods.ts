/* eslint-disable no-console */
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { marketplaceListAppId } from './utils/marketplaceListAppId'

export function create(
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
    const createResult = await nftmClient.create.bare()

    const mbrTxn = await algorand.transactions.payment({
      sender,
      receiver: createResult.appAddress,
      amount: algokit.algos(0.1 + 0.1),
      extraFee: algokit.algos(0.001),
    })

    const sendAssetToSell = {
      assetId: assetBeingSold,
      sender,
      receiver: createResult.appAddress,
      amount: quantity,
    }

    const result = await algorand
      .newGroup()
      .addMethodCall({
        sender: sender,
        appId: BigInt(createResult.appId),
        method: nftmClient.appClient.getABIMethod('bootstrap')!,
        args: [assetBeingSold, unitaryPrice, mbrTxn],
      })
      .addAssetTransfer(sendAssetToSell)
      .addMethodCall({
        sender: sender,
        appId: BigInt(marketplaceListAppId),
        method: listClient.appClient.getABIMethod('add_marketplace_to_list')!,
        args: [createResult.appId],
      })
      .execute()

    console.log('List Result: ', result.returns![1].returnValue)
  }
}

export function buy(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  sender: string,
  assetId: bigint,
  appAddress: string,
  quantity: bigint,
  unitaryPrice: bigint,
) {
  return async () => {
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
      // 구매자가 NFT에 옵트인
      const appId = (await nftmClient.appClient.getAppReference()).appId
      await algorand
        .newGroup()
        .addAssetOptIn({
          sender: sender,
          assetId: assetId,
        })
        .addMethodCall({
          sender: sender,
          appId: BigInt(appId),
          method: nftmClient.appClient.getABIMethod('buy')!,
          args: [buyerTxn, quantity],
        })
        .execute()
      console.log(`${sender}가 에셋에 옵트인 완료했어요!`)
      return
    }

    await nftmClient.buy({
      buyerTxn,
      quantity,
    })
    console.log('buy done')
  }
}

export function deleteApp(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  listClient: NftMarketplaceListClient,
  sender: string,
  appId: number,
) {
  return async () => {
    console.log('deleting app')

    await algorand
      .newGroup()
      .addMethodCall({
        sender: sender,
        appId: BigInt(appId),
        method: nftmClient.appClient.getABIMethod('withdraw_and_delete')!,
        args: [],
        extraFee: algokit.algos(0.003),
        onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
      })
      .addMethodCall({
        sender: sender,
        appId: BigInt(marketplaceListAppId),
        method: listClient.appClient.getABIMethod('remove_marketplace_from_list')!,
        args: [appId],
      })
      .execute()
  }
}
