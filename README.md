# 🎓 카이스트 오라클 X 알고랜드 개발자 세션 06/01/24

## 🚩 파이썬으로 NFT Marketplace 스마트 계약을 작성하고 React 앱과 연동하는 방법을 배워보자!

> 🚧✋ 잠깐! 오늘 코딩 과제를 성공적으로 끝내기 위해 꼭!! 아래 설명을 차례대로 다 읽고 진행해주세요!!!

카이스트 오라클 X 알고랜드 개발자 세션에 오신 여러분 반갑습니다~!

이 코딩과제에서 여러분은 [알고랜드 파이썬](https://algorandfoundation.github.io/puya/index.html)으로 NFT 마켓플레이스 스마트 계약을 직접 구현하고 [AlgoKit Utils TypeScript](https://github.com/algorandfoundation/algokit-utils-ts)와 [Application Client](https://github.com/algorandfoundation/algokit-client-generator-ts/tree/main)를 사용해 스마트계약을 배포 및 호출하는 React 프론트앤드 연동을 구축해볼 것 입니다.

이 Algokit 프로젝트는 2개의 프로젝트 폴더가 있습니다.

1. orakle-nft-marketplace-app-contracts: 알고킷 smart contract 탬플릿으로 만들어진 NFT 마켓플레이스 스마트계약이 들어있는 프로젝트.
2. orakle-nft-marketplace-app-frontend: 알고킷 frontend 템플릿으로 만들어진 React 프로젝트.

> 코딩 과제는 **총 9문제** 로 구성이 되어 있으며, 문제들은 여러 파일들에 분포되어있으니 밑에 **체크포인트 3** 설명을 꼼꼼히 읽고 진행해주세요!

### 개발자 리소스:
- [알고랜드 개발자 문서](https://developer.algorand.org/docs/)
- [알고랜드 디스코드(디버깅, 코드 관련 질의응답)](https://discord.com/invite/algorand)
- [알고랜드 파이썬 개발자 문서](https://algorandfoundation.github.io/puya/)
- [알고랜드 파이썬 깃헙(예시 코드, 소스코드)](https://github.com/algorandfoundation/puya)
- [Algokit Utils TypeScript](https://github.com/algorandfoundation/algokit-utils-ts/tree/main)

## 체크포인트 1: 🧰 알고랜드 개발에 필요한 툴킷 설치

1. [AlgoKit 설치](https://github.com/algorandfoundation/algokit-cli/tree/main?tab=readme-ov-file#install).
2. [Docker 설치](https://www.docker.com/products/docker-desktop/). It is used to run a local Algorand network for development.
3. [Python 3.12 이상 설치](https://www.python.org/downloads/)
4. [Node.JS / npm 설치](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## 체크포인트 2: 💻 개발 환경 셋업

1. [이 리포를 fork 해주세요.](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
2. Fork한 리포를 git clone 해주세요.
3. VSCode에서 이 폴더를 열람해주세요.
4. 열람 후 `orakle-nft-marketplace-app.code-workspace` 파일을 열고 후 `open workspace` 버튼을 눌러 workspace 모드를 실행시켜주세요.
5. 이제 VSCode 터미널이 3개가 자동 생성될 것 입니다: `ROOT` `orakle-nft-marketplace-app-contracts` `orakle-nft-marketplace-app-frontend`. 이 중 `ROOT` VSCode 터미널에서 `algokit project bootstrap all` 커맨드를 실행시켜 dependencies들을 설치해주세요. 이러면 모든 프로젝트 폴더의 dependencies들이 설치됩니다.
> 만약 3개의 터미널의 자동으로 열리지 않으면 새로운 터미널을 + 버튼을 눌러 만들고 `ROOT`를 선택하시면 됩니다.

```bash
algokit project bootstrap all
```

6. 이제 `orakle-nft-marketplace-app-contracts` 터미널을 선택한 뒤 `poetry shell` 커맨드를 실행해 파이썬 virtual environment를 활성화 시켜주세요.
   1. 파이썬 virtual environment를 비활성화 시킬때는 `exit` 커맨드를 실행하시면 됩니다.

🎉 이제 모든 준비가 되었습니다! Good luck coding! 💻

리포 fork, clone 튜토리얼:
https://github.com/algorand-fix-the-bug-campaign/challenge-1/assets/52557585/acde8053-a8dd-4f53-8bad-45de1068bfda

## 체크포인트 3: 📝 문제를 해결하세요!

이 코딩 과제는 **총 9문제**로 구성되어 있으면
- 1-4문제는 스마트계약 문제
- 5-9문제는 프론트앤드 연동
관련 문제입니다. 아래 설명을 차례대로 읽고 진행해주세요!

### 로컬 네트워크 실행
1. 도커 데스크탑을 실행한 뒤 터미널에서 `algokit localnet start` 커맨드로 로컬 네트워크를 실행시켜주세요.[더 자세히 알고 싶다면 여기를 클릭해주세요!](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/localnet.md#creating--starting-the-localnet). 오늘 모든 코드는 로컬 네트워크에서 실행됩니다.

### 1-4문제: 스마트계약 문제 진행 설명
1. `orakle-nft-marketplace-app-contracts` 터미널에서 `poetry shell`를 실행해서 파이썬 가상환경을 켰는지 확인하세요.
2. `orakle-nft-marketplace-app-contracts/smart_contract/nft_marketplace/contract.ts`로 가시면 문제 1-4가 주석으로 작성되어있습니다.
    설명을 자세히 읽고 문제들을 해결하세요!
3. 문제를 다 해결한 뒤 터미널에서 `algokit project run build` 커맨드를 실행해 스마트 계약을 컴파일 하시고 `algokit project deploy localnet` 커맨드를 실행해 `smart_contracts/digital_marketplace/deploy-config.ts` 파일을 실행하세요!
실행 후 다음과 같은 콘솔 값이 출력되면 성공적으로 모든 문제를 해결하신겁니다! 👏👏 이제 문제 5-9로 넘어가세요.
<img width="1033" alt="image" src="https://github.com/algorand-devrel/orakle-coding-assignment-2024/assets/52557585/7c6b578d-fd59-42e6-a11d-184ed7552cef">

### 5-9문제: 프론트앤드 연동 문제 진행 설명
1. `orakle-nft-marketplace-app-frontend` 터미널로 가서 `npm run dev`를 실행해 로컬 서버를 실행한 뒤, 브라우저에 페이지를 열고 진행해주세요!
3. 문제 5은 `src/utils/getCurrentNftmClient.ts` 파일에 있습니다! 파일에 문제가 적혀있습니다.
4. 문제 6-9는 `src/methods.ts` 파일에 있습니다! 파일에 문제들이 적혀있습니다.
3. 문제들를 다 해결한 뒤 아래 설명대로 직접 웹사이트에 가서 실행해보세요:

#### 로컬 지갑 연결
1. `Wallet Connection` 버튼을 눌러 로컬 지갑을 연결하세요.
#### 테스트용 NFT 생성
2. 위에 `mint test nft` 버튼을 눌러 테스트용 nft를 만드세요. 코드가 궁금하시면 `src/components/MintNft.tsx`를 확인하세요. 테스트용이기에 고정적으로
   같은 이미지에 total supply 10개인 NFT를 만듭니다. 서명창에서 패스워드 기입 없이 `ok` 버튼을 눌러 서명하세요.
#### 판매할 NFT 리스팅
3. 위에 `sell NFT` 버튼을 누르고 `Select NFT to Sell`에서 2단계에서 만든 테스트 NFT를 선택, 개수는 1개, 가격은 1알고로 설정한 뒤 `publish`를 눌러 nft를
   리스팅하세요. 이때 서명 창이 **4번** 나옵니다. 서명창에서 패스워드 기입 없이 `ok` 버튼을 눌러 서명하세요.
#### NFT 구매
4. `Buy now` 버튼을 누르고 Buy Amount를 1개로 설정한 뒤 `Buy NFT!`를 눌러 구매하세요. 서명 창 1번 나옵니다.
#### 수익금 회수 및 스마트계약 삭제
5. `Withdraw Profit` 버튼을 누르고 `Withdraw all profits` 버튼을 눌러 수익금을 회수하고 스마트계약을 삭제하세요. 서명 창은 2번 나옵니다.

이 모든 것이 에러없이 제대로 실행되면 성공적으로 과제를 해결하신겁니다! 🎉🎉 이제부턴 자유롭게 직접 만든 디지털 마켓플레이스 앱을 사용해보세요~!

## 체크포인트 4: 💯 과제 제출하는 방법

1. 성공적으로 모든 문제를 해결하셨다면 본인이 fork한 깃헙 리포로 코드를 푸쉬해주세요. 그런 다음 [원래의 리포로 Pull request를 해주세요.](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
2. Pull Request 템플렛을 따라 PR를 만들어 제출해주세요!

첫번째 알고랜드 풀스텍 디앱을 파이썬과 알고킷으로 만드신 것을 축하드립니다! 🎉🎉


# orakle-nft-marketplace-app (default algokit readme)

This starter full stack project has been generated using AlgoKit. See below for default getting started instructions.

## Setup

### Initial setup
1. Clone this repository to your local machine.
2. Ensure [Docker](https://www.docker.com/) is installed and operational. Then, install `AlgoKit` following this [guide](https://github.com/algorandfoundation/algokit-cli#install).
3. Run `algokit project bootstrap all` in the project directory. This command sets up your environment by installing necessary dependencies, setting up a Python virtual environment, and preparing your `.env` file.
4. To build your project, execute `algokit project run build`. This compiles your project and prepares it for running.
5. For project-specific instructions, refer to the READMEs of the child projects:
   - Smart Contracts: [orakle-nft-marketplace-app-contracts](projects/orakle-nft-marketplace-app-contracts/README.md)
   - Frontend Application: [orakle-nft-marketplace-app-frontend](projects/orakle-nft-marketplace-app-frontend/README.md)

> This project is structured as a monorepo, refer to the [documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/project/run.md) to learn more about custom command orchestration via `algokit project run`.

### Subsequently

1. If you update to the latest source code and there are new dependencies, you will need to run `algokit project bootstrap all` again.
2. Follow step 3 above.

### Continuous Integration / Continuous Deployment (CI/CD)

This project uses [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) to define CI/CD workflows, which are located in the [`.github/workflows`](./.github/workflows) folder. You can configure these actions to suit your project's needs, including CI checks, audits, linting, type checking, testing, and deployments to TestNet.

For pushes to `main` branch, after the above checks pass, the following deployment actions are performed:
  - The smart contract(s) are deployed to TestNet using [AlgoNode](https://algonode.io).
  - The frontend application is deployed to a provider of your choice (Netlify, Vercel, etc.). See [frontend README](frontend/README.md) for more information.

> Please note deployment of smart contracts is done via `algokit deploy` command which can be invoked both via CI as seen on this project, or locally. For more information on how to use `algokit deploy` please see [AlgoKit documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/deploy.md).

## Tools

This project makes use of Python and React to build Algorand smart contracts and to provide a base project configuration to develop frontends for your Algorand dApps and interactions with smart contracts. The following tools are in use:

- Algorand, AlgoKit, and AlgoKit Utils
- Python dependencies including Poetry, Black, Ruff or Flake8, mypy, pytest, and pip-audit
- React and related dependencies including AlgoKit Utils, Tailwind CSS, daisyUI, use-wallet, npm, jest, playwright, Prettier, ESLint, and Github Actions workflows for build validation

### VS Code

It has also been configured to have a productive dev experience out of the box in [VS Code](https://code.visualstudio.com/), see the [backend .vscode](./backend/.vscode) and [frontend .vscode](./frontend/.vscode) folders for more details.

## Integrating with smart contracts and application clients

Refer to the [orakle-nft-marketplace-app-contracts](projects/orakle-nft-marketplace-app-contracts/README.md) folder for overview of working with smart contracts, [projects/orakle-nft-marketplace-app-frontend](projects/orakle-nft-marketplace-app-frontend/README.md) for overview of the React project and the [projects/orakle-nft-marketplace-app-frontend/contracts](projects/orakle-nft-marketplace-app-frontend/src/contracts/README.md) folder for README on adding new smart contracts from backend as application clients on your frontend. The templates provided in these folders will help you get started.
When you compile and generate smart contract artifacts, your frontend component will automatically generate typescript application clients from smart contract artifacts and move them to `frontend/src/contracts` folder, see [`generate:app-clients` in package.json](projects/orakle-nft-marketplace-app-frontend/package.json). Afterwards, you are free to import and use them in your frontend application.

The frontend starter also provides an example of interactions with your NftMarketplaceClient in [`AppCalls.tsx`](projects/orakle-nft-marketplace-app-frontend/src/components/AppCalls.tsx) component by default.

## Next Steps

You can take this project and customize it to build your own decentralized applications on Algorand. Make sure to understand how to use AlgoKit and how to write smart contracts for Algorand before you start.
