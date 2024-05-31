import * as algokit from '@algorandfoundation/algokit-utils'
import { PersonalBankClient } from '../artifacts/personal_bank/client'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying Personal Bank Contract ===')

  // 여러 클라이언트 생성
  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const algorand = algokit.AlgorandClient.defaultLocalNet()

  // 랜덤 계정 생성 후 자금 지급
  const deployer = await algorand.account.random()
  const user = await algorand.account.random()
  const user2 = await algorand.account.random()
  const accounts = [deployer, user, user2]

  const dispenser = await algorand.account.dispenser()
  for (let i = 0; i < accounts.length; i++) {
    await algorand.send.payment(
      {
        sender: dispenser.addr,
        receiver: accounts[i].addr,
        amount: algokit.algos(10),
      },
      { suppressLog: true },
    )
  }

  //1. Deployer의 Personal Bank 앱 클라이언트 생성
  const appClient = new PersonalBankClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod,
  )

  // 2. Personal Bank 앱을 배포
  const app = await appClient.create.bare()

  // 3. 앱 미니멈 밸런스 0.1알고를 송금 (https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/?from_query=minimum#minimum-balance-requirement-for-a-smart-contract)
  await algorand.send.payment(
    {
      sender: deployer.addr,
      receiver: app.appAddress,
      amount: algokit.algos(0.1),
    },
    { suppressLog: true },
  )

  // User1 User2의 앱 클라이언트를 생성
  const user1AppClient = new PersonalBankClient(
    {
      resolveBy: 'id',
      id: app.appId,
      sender: user,
    },
    algod,
  )

  const user2AppClient = new PersonalBankClient(
    {
      resolveBy: 'id',
      id: app.appId,
      sender: user2,
    },
    algod,
  )

  async function userDepositScript(
    appClient: PersonalBankClient,
    userName: string,
    user: TransactionSignerAccount,
    depositAmt: number,
  ): Promise<void> {
    // User가 Personal Bank에 5 알고를 입금하는 payment 트랜잭션 생성
    const depositTxn = await algorand.transactions.payment({
      sender: user.addr,
      receiver: app.appAddress,
      amount: algokit.algos(depositAmt),
    })

    /*
   어토믹 트랜잭션에 payment 트랜잭션, 앱 옵트인 트랜잭션, 입금 메소드 호출 트랜잭션을 그룹화하고 동시에 실행합니다.
   
   여기서 왜 이 3개의 트랜잭션을 어토믹하게 그룹화해야 할까요?
    - payment txn: Algorand 스마트 컨트랙트는 계정이 아니기 때문에, payment를 컨트랙트 계정으로 보내야 합니다.
    - app opt-in txn: 입금자는 컨트랙트에 로컬 상태를 생성할 수 있도록 컨트랙트에 옵트인해야 합니다.
    - deposit 메소드 호출 txn: 컨트랙트 메소드 호출로 컨트랙트에 상태 업데이트 로직을 실행합니다. 
      이때 deposit 메소드에 ptxn이라는 transaction type이 들어있기 때문에 deposit 메소드 호출때 
      첫번째 전달값으로 넣어주면 자동으로 어토믹 그룹으로 묶어줍니다.
   
   */
    await appClient.compose().optIn.optInToApp({}).deposit({ ptxn: depositTxn }).execute({ suppressLog: true })

    console.log(`=== ${userName} 출금 전 ===`)

    let appInfo = await algorand.account.getInformation(app.appAddress)
    console.log(`컨트랙트 계정 balance: ${appInfo.amount / 1_000_000} Algos`)

    const userInfo = await algorand.account.getInformation(user)
    console.log(`${userName} 계정 balance: ${userInfo.amount / 1_000_000} Algos`)

    let localStateCheck = await appClient.getLocalState(user)
    const userBalance = localStateCheck.balance?.asNumber()
    console.log(`${userName}의 로컬 상태: ${Number(userBalance) / 1_000_000} Algos`)

    let globalStateCheck = await appClient.getGlobalState()
    const depositors = globalStateCheck.depositors?.asNumber()
    console.log(`총 입금자 수: ${depositors}`)
  }
  await userDepositScript(user1AppClient, 'user1', user, 5)
  await userDepositScript(user2AppClient, 'user2', user2, 8)

  async function userWithdrawScript(
    appClient: PersonalBankClient,
    userName: string,
    user: TransactionSignerAccount,
  ): Promise<void> {
    await appClient.closeOut.withdraw({}, { sendParams: { fee: algokit.transactionFees(2) } })

    console.log(`=== ${userName} 출금 후 ===`)
    const appInfo = await algorand.account.getInformation(app.appAddress)
    console.log(`컨트랙트 계정 balance: ${appInfo.amount / 1_000_000} Algos`)

    const userInfo = await algorand.account.getInformation(user)
    console.log(`${userName} 계정 balance: ${userInfo.amount / 1_000_000} Algos`)

    try {
      const localStateCheck = await appClient.getLocalState(user)
      console.log(`User의 로컬 상태: ${localStateCheck}`)
    } catch (e) {
      console.log('User의 로컬 상태: 없음')
    }

    let globalStateCheck = await appClient.getGlobalState()
    const depositors = globalStateCheck.depositors?.asNumber()
    console.log(`총 입금자 수: ${depositors}`)
  }
  await userWithdrawScript(user1AppClient, 'user1', user)
  await userWithdrawScript(user2AppClient, 'user2', user2)
}
