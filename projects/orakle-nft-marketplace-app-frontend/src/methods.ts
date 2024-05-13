import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'

/**
 * Create the application and opt it into the desired asset
 */

// const = //marketplace contract list app id
export function create(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  listClient: NftMarketplaceListClient,
  sender: string,
  unitaryPrice: bigint,
  quantity: bigint,
  assetBeingSold: bigint,
  setAppId: (id: number) => void,
) {
  return async () => {
    const createResult = await nftmClient.create.bare()
    console.log('App Id: ', createResult.appId)
    // 마켓플레이스 스마트 계약 기록하는 앱에 앱 아이디 기록하기

    const listResult = await listClient.addMarketplaceToList({ appId: createResult.appId })
    console.log('List Result: ', listResult.return)

    const mbrTxn = await algorand.transactions.payment({
      sender,
      receiver: createResult.appAddress,
      amount: algokit.algos(0.1 + 0.1),
      extraFee: algokit.algos(0.001),
    })

    await nftmClient.bootstrap({ asset: assetBeingSold, unitaryPrice: unitaryPrice, mbrPay: mbrTxn })
    console.log('bootstrap done')

    await algorand.send.assetTransfer({
      assetId: assetBeingSold,
      sender,
      receiver: createResult.appAddress,
      amount: quantity,
    })
    console.log('asset transfer done')

    setAppId(Number(createResult.appId))
  }
}

export function buy(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  sender: string,
  appAddress: string,
  quantity: bigint,
  unitaryPrice: bigint,
  setUnitsLeft: React.Dispatch<React.SetStateAction<bigint>>,
) {
  return async () => {
    const buyerTxn = await algorand.transactions.payment({
      sender,
      receiver: appAddress,
      amount: algokit.microAlgos(Number(quantity * unitaryPrice)),
      extraFee: algokit.algos(0.001),
    })

    await nftmClient.buy({
      buyerTxn,
      quantity,
    })

    const state = await nftmClient.getGlobalState()
    const info = await algorand.account.getAssetInformation(appAddress, state.assetId!.asBigInt())
    setUnitsLeft(info.balance)
  }
}

export function deleteApp(nftmClient: NftMarketplaceClient, setAppId: (id: number) => void, setTotalProfit: (profit: bigint) => void) {
  return async () => {
    const totalProfit = await nftmClient.delete.withdrawAndDelete({}, { sendParams: { fee: algokit.algos(0.003) } })
    setAppId(0)
    setTotalProfit(totalProfit.return!)
  }
}

export function readMarketplaceList(listClient: NftMarketplaceListClient, setAppList: (list: bigint[]) => void) {
  return async () => {
    const result = await listClient.readMarketplaceList({})
    setAppList(result.return!)
  }
}
