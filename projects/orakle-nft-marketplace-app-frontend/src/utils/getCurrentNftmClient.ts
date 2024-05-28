import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TransactionSigner } from 'algosdk'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'

export function getCurrentNftmClient(
  algorandClient: AlgorandClient,
  currentAppId: bigint | number,
  activeAddress: string,
  signer: TransactionSigner,
): NftMarketplaceClient {
  /*
  문제 5
  NFT 마켓플레이스 앱 클라이언트 인스턴스를 생성하세요.

  앱 클라이언트는 쉽고 간편하게 스마트계약을 배포 및 호출할 수 있도록 해주는 클라이언트입니다.
  앱 클라이언트 인스턴스를 만드는 방법은 두가지가 있습니다.
  1. resolve by creator and name: 배포자와 앱 이름으로 앱 클라이언트를 찾아서 생성
  2. resolve by id: 앱 ID로 앱 클라이언트를 찾아서 생성

  이 문제에서는 resolveBy: 'id'를 사용해주세요.

  주목!!!
  - 3번째 줄에서 import { NftMarketplaceClient } from '../contracts/NftMarketplace'로 import한 클래스는
    Nft 마켓플레이스 앱을 빌드할때 자동 생성된 클라이언트 클래스입니다.
  - id값에는 currentAppId를 넣어주세요.
  - sender값에는 { addr: activeAddress!, signer }를 복붙해주세요. useWallet를 통해 현재 연결된 지갑 주소와 서명자를 포함한 객체를 설정해주는 코드입니다.
  - NftMarketplaceClient 생성자의 두번째 인자인 algod는 algorandClient.client 안에 있습니다.

  힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#creating-an-application-client-instance
  */

  // 문제 5 시작
  const nftmClient = new NftMarketplaceClient(
    {
      resolveBy: 'id',
      id: currentAppId,
      sender: { addr: activeAddress, signer },
    },
    algorandClient.client.algod,
  )
  // 문제 5 끝

  return nftmClient
}
