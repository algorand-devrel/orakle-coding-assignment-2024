import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TransactionSigner } from 'algosdk'
import { NftMarketplaceClient } from '../contracts/NftMarketplace'

/*
=== 먼저 읽고 진행해주세요!! ===

getCurrentNftmClient 함수는 NFT 마켓플레이스 앱 클라이언트 인스턴스를 생성하는 함수입니다.
이 클라이언트 인스턴스로 저희 풀스택 앱에서 NFT 마켓플레이스 앱을 배포하고 호출할 수 있습니다.

이 클라이언트는 아래 3군데에서 사용되고 있습니다.
1. src/components/Sell.tsx에서 NFT 판매 리스팅을 할때 사용. src/methods.ts의 create 메서드에서 사용.
2. src/components/Buy.tsx에서 NFT 구매를 할때 사용. src/methods.ts의 buy 메서드에서 사용.
3. src/components/Withdraw.tsx에서 수익금을 인출 및 스마트계약 삭제할때 사용. src/methods.ts의 deleteApp 메서드에서 사용.
*/

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
    Nft 마켓플레이스 앱을 빌드할때 자동 생성된 클라이언트 클래스입니다. 이 파일이 없다면 `npm run dev`를 실행하시면 자동으로 생성됩니다.
  - 이 문제는 getCurrentNftmClient 함수의 인수로 들어오는 4개의 인수를 모두 사용하셔서 푸셔야 합니다.
  - id값에는 getCurrentNftmClient의 인수값으로 들어오는 currentAppId를 넣어주세요.
  - sender값에는 { addr: activeAddress!, signer }를 복붙해주세요. useWallet를 통해 현재 연결된 지갑 주소와 서명자를 포함한 객체를 설정해주는 코드입니다.
  - NftMarketplaceClient 생성자의 두번째 인자인 algod는 getCurrentNftmClient의 인수값으로 들어오는 algorandClient의 algorandClient.client 안에 있습니다.

  힌트: https://github.com/algorandfoundation/algokit-client-generator-ts/blob/main/docs/usage.md#creating-an-application-client-instance
  */

  // 문제 5 시작
  const nftmClient = new NftMarketplaceClient(
    {
      resolveBy: 'id',
      id: currentAppId,
      sender: { addr: activeAddress!, signer },
    },
    algorandClient.client.algod,
  )
  // 문제 5 끝

  return nftmClient
}
