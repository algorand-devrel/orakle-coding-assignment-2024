import * as algokit from '@algorandfoundation/algokit-utils'
import { NftMarketplaceClient } from './contracts/NftMarketplace'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'

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
    const createResult = await nftmClient.create.bare()
    console.log('App Id: ', createResult.appId)

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
  }
}

export function buy(
  algorand: algokit.AlgorandClient,
  nftmClient: NftMarketplaceClient,
  sender: string,
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
    console.log('buyerTxn', buyerTxn)

    await nftmClient.buy({
      buyerTxn,
      quantity,
    })
    console.log('buy done')
  }
}

export function deleteApp(
  nftmClient: NftMarketplaceClient,
  listClient: NftMarketplaceListClient,
  appId: number,
  setTotalProfit: (profit: bigint) => void,
) {
  return async () => {
    console.log('deleting app')
    const totalProfit = await nftmClient.delete.withdrawAndDelete({}, { sendParams: { fee: algokit.algos(0.003) } })
    console.log('Total Profit: ', totalProfit.return)

    listClient.removeMarketplaceFromList({ appId: appId })
    setTotalProfit(totalProfit.return!)
  }
}
