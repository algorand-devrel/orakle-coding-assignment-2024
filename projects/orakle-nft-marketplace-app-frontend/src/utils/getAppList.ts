import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import algosdk, { ABIArrayDynamicType, ABIUintType, ABIValue, TransactionSigner } from 'algosdk'
import axios from 'axios'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { appDetails } from '../interfaces/appDetails'

export const getAppList = async (
  algorandClient: AlgorandClient,
  listClient: NftMarketplaceListClient,
  activeAddress: string,
  signer: TransactionSigner,
) => {
  let appList: ABIValue[] = []

  const listAsBytes = (await listClient.getGlobalState()).marketplaceList?.asByteArray()

  const list = new ABIArrayDynamicType(new ABIUintType(64)).decode(listAsBytes!)
  appList = list
  const appDetailsList: appDetails[] = []
  for (const appId of appList) {
    const nftmClient = new NftMarketplaceClient(
      {
        resolveBy: 'id',
        id: Number(appId),
        sender: { addr: activeAddress!, signer },
      },
      algorandClient.client.algod,
    )

    const appDetails: appDetails = {
      creator: '',
      appId: BigInt(Number(appId.valueOf())),
      unitaryPrice: 0n,
      assetId: 0n,
      assetName: '',
      imageUrl: '',
      remainingQty: 0n,
    }
    const appInfo = await algorandClient.client.algod.getApplicationByID(Number(appId)).do()
    appDetails.creator = appInfo['params']['creator']
    const globalState = await nftmClient.getGlobalState()
    appDetails.unitaryPrice = globalState.unitaryPrice?.asBigInt() || 0n
    const assetId = globalState.assetId?.asBigInt() || 0n
    appDetails.assetId = assetId

    const assetDetail = await algorandClient.client.algod.getAssetByID(Number(assetId)).do()
    appDetails.assetName = assetDetail['params']['name']
    const inputString = assetDetail['params']['url'] //returns -> "url": "ipfs://QmSiHBwQgK7Nnzas4Chc9Jg9EmJYjwAH3P4r6WeTAWme3w/#arc3",
    console.log('inputString', inputString)
    const slicedURL = inputString.split('ipfs://')[1]
    let response
    try {
      response = await axios.get(`https://ipfs.algonode.xyz/ipfs/${slicedURL}`)
    } catch (e) {
      console.log('error', e)
      continue
    }
    const responseImage = response.data.image
    const slicedResponseImage = responseImage.split('ipfs://')[1]
    const outputString = `https://ipfs.algonode.xyz/ipfs/${slicedResponseImage}`
    appDetails.imageUrl = outputString

    const info = await algorandClient.account.getAssetInformation(algosdk.getApplicationAddress(Number(appId)), assetId)
    appDetails.remainingQty = info.balance

    appDetailsList.push(appDetails)
  }
  return appDetailsList
}
