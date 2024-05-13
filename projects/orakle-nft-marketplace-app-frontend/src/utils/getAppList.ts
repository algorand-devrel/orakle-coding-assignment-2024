import algosdk, { TransactionSigner } from 'algosdk'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { algorandObject } from '../interfaces/algorandObject'
import { appDetails } from '../interfaces/appDetails'

export const getAppList = async (algorandObject: algorandObject, activeAddress: string, signer: TransactionSigner) => {
  let appList: bigint[] = []
  const list = await algorandObject.listClient.readMarketplaceList({})
  appList = list.return!
  console.log('appList', appList)

  const appDetailsList: appDetails[] = []
  for (const appId of appList) {
    const nftmClient = new NftMarketplaceClient(
      {
        resolveBy: 'id',
        id: Number(appId),
        sender: { addr: activeAddress!, signer },
      },
      algorandObject.algorand.client.algod,
    )

    const appDetails: appDetails = {
      creator: '',
      appId: appId,
      unitaryPrice: 0n,
      assetId: 0n,
      assetName: '',
      imageUrl: '',
      remainingQty: 0n,
      totalQty: 0n,
    }
    const appInfo = await algorandObject.algorand.client.algod.getApplicationByID(Number(appId)).do()
    appDetails.creator = appInfo['params']['creator']
    const globalState = await nftmClient.getGlobalState()
    appDetails.unitaryPrice = globalState.unitaryPrice?.asBigInt() || 0n
    const assetId = globalState.assetId?.asBigInt() || 0n
    appDetails.assetId = assetId

    const assetDetail = await algorandObject.algorand.client.algod.getAssetByID(Number(assetId)).do()
    appDetails.assetName = assetDetail['params']['name']
    // appDetails.imageUrl = assetDetail['params']['url'] //  returns -> "url": "ipfs://QmSiHBwQgK7Nnzas4Chc9Jg9EmJYjwAH3P4r6WeTAWme3w/#arc3",
    appDetails.imageUrl = 'https://gateway.pinata.cloud/ipfs/QmV1dyum28Y4Nhz6wVRTgb1nc6CwqHUwSvkyji1sPGzt6X'

    const info = await algorandObject.algorand.account.getAssetInformation(algosdk.getApplicationAddress(appId), assetId)
    appDetails.remainingQty = info.balance

    appDetails.totalQty = assetDetail['params']['total']

    appDetailsList.push(appDetails)
  }
  return appDetailsList
}
