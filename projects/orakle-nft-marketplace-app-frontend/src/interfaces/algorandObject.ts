import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'

export interface algorandObject {
  algorand: AlgorandClient
  nftmClient: NftMarketplaceClient
  listClient: NftMarketplaceListClient
  appId: number
}
