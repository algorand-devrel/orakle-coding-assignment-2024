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
  디지털 마켓플레이스 앱 클라이언트 인스턴스를 생성하세요.

  앱 클라이언트는 쉽고 간편하게 스마트계약을 배포 및 호출할 수 있도록 해주는 클라이언트입니다.
  앱 클라이언트 인스턴스를 만드는 방법은 두가지가 있습니다.
  1. resolve by creator and name: 배포자와 앱 이름으로 앱 클라이언트를 찾아서 생성
  2. resolve by id: 앱 ID로 앱 클라이언트를 찾아서 생성

  둘 다 사용 가능하지만 각각 장단점이 있어요.
  creator and name
  - 장점: 앱 이름과 배포자만 알면 앱 아이디를 하드코드할 필요가 없고 개발 중 여러 네트워크에서 자동적으로 앱 아이디를 찾아주기 때문에 편리합니다.
  - 단점: indexer가 필요하기 때문에 indexer API 설정을 해야합니다.

  id
  - 장점: indexer가 필요없어서 가볍게 앱 클라이언트를 생성할 수 있습니다.
  - 단점: 앱 아이디를 알아야하기 때문에 네트워크가 바뀔때 코드를 바꿔줘야할 수 있습니다.

  주목!!!
  - 이 파일 맨 위에 이 코드를 복붙해 마켓플레이스 앱 클라이언트 class를 import하세요: import { DigitalMarketplaceClient } from './contracts/DigitalMarketplace'
  - 여기서는 resolve by id를 사용해주세요!
  - sender값에는 { addr: activeAddress!, signer }를 복붙해주세요. useWallet를 통해 현재 연결된 지갑 주소와 서명자를 사용하는 코드입니다.

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
