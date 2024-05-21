import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'

export interface algorandObject {
  algorand: AlgorandClient
  listClient: NftMarketplaceListClient
}
