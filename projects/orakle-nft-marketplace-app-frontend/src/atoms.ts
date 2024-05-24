import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { atom } from 'jotai'
import { NftMarketplaceListClient } from './contracts/NftMarketplaceList'
import { appDetails } from './interfaces/appDetails'

export const algorandClientAtom = atom<AlgorandClient | null>(null)
export const listClientAtom = atom<NftMarketplaceListClient | null>(null)
export const isSellingAtom = atom<boolean>(false)
export const appDetailsListAtom = atom<appDetails[]>([])
export const assetHoldingAtom = atom<bigint[]>([])
