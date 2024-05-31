import { useWallet } from '@txnlab/use-wallet'
import { useAtomValue } from 'jotai'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { algorandClientAtom, appDetailsListAtom, listClientAtom } from '../atoms'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import * as methods from '../methods'
import { getCurrentNftmClient } from '../utils/getCurrentNftmClient'

interface WithdrawInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Withdraw = ({ openModal, setModalState }: WithdrawInterface) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress, clients, activeAccount, isActive, isReady } = useWallet()
  const algorandClient = useAtomValue(algorandClientAtom)
  const listClient = useAtomValue(listClientAtom)
  const appDetailsList = useAtomValue(appDetailsListAtom)

  const handleWithdraw = async () => {
    setLoading(true)
    if (!isActive || !isReady) {
      enqueueSnackbar('not active', { variant: 'warning' })
      setLoading(true)
      return
    }
    if (!signer || !activeAddress || !clients || !activeAccount) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(true)
      return
    }

    if (!algorandClient || !listClient) {
      enqueueSnackbar('client not ready', { variant: 'warning' })
      setLoading(true)
      return
    }

    let nftmClient: NftMarketplaceClient | undefined = undefined
    let myAppId: bigint | undefined = undefined

    for (const appDetails of appDetailsList) {
      if (appDetails.creator == activeAddress) {
        nftmClient = await getCurrentNftmClient(algorandClient, appDetails.appId, activeAddress, signer)

        myAppId = appDetails.appId
        break
      }
    }

    if (!nftmClient) {
      enqueueSnackbar('No app details found for the active address', { variant: 'error' })
      setLoading(false)
      return
    }

    try {
      await methods.deleteAppAndWithdraw(nftmClient, listClient, Number(myAppId))()
    } catch (error) {
      enqueueSnackbar('Error deleting the app', { variant: 'error' })
      setLoading(false)
      return
    }
    enqueueSnackbar('Profits withdrawn successfully', { variant: 'success' })

    setLoading(false)
    window.location.reload()
  }

  return (
    <dialog id="Withdraw_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Withdraw Profit</h3>
        <br />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button data-test-id="send-algo" className={`btn btn-accent`} onClick={handleWithdraw}>
            {loading ? <span className="loading loading-spinner" /> : 'Withdraw all profits'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Withdraw
