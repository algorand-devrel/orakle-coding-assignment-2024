import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'
import { NftMarketplaceListClient } from '../contracts/NftMarketplaceList'
import { algorandObject } from '../interfaces/algorandObject'
import { appDetails } from '../interfaces/appDetails'
import * as methods from '../methods'

interface WithdrawInterface {
  algorandObject: algorandObject
  openModal: boolean
  appDetailsList: appDetails[]
  setModalState: (value: boolean) => void
  setAppId: (id: number) => void
  setTotalProfit: (value: bigint) => void
  listClient: NftMarketplaceListClient
}

// TODO: Implement withdraw tx call
const Withdraw = ({
  algorandObject,
  openModal,
  appDetailsList,
  setModalState,
  setAppId,
  setTotalProfit,
  listClient,
}: WithdrawInterface) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()

  const { signer, activeAddress } = useWallet()

  const handleWithdraw = async () => {
    setLoading(true)

    if (!signer || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    let nftmClient: NftMarketplaceClient | undefined = undefined
    let myAppId: bigint | undefined = undefined

    for (const appDetails of appDetailsList) {
      if (appDetails.creator == activeAddress) {
        nftmClient = new NftMarketplaceClient(
          {
            resolveBy: 'id',
            id: appDetails.appId,
            sender: { addr: activeAddress!, signer },
          },
          algorandObject.algorand.client.algod,
        )
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
      await methods.deleteApp(nftmClient, listClient, Number(myAppId), setAppId, setTotalProfit)()
    } catch (error) {
      enqueueSnackbar('Error while withdrawing profits', { variant: 'error' })
      setLoading(false)
      return
    }
    enqueueSnackbar('Profits withdrawn successfully', { variant: 'success' })

    setLoading(false)
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
          <button data-test-id="send-algo" className={`btn`} onClick={handleWithdraw}>
            {loading ? <span className="loading loading-spinner" /> : 'Withdraw all profits'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Withdraw
