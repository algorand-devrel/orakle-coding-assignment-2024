# pyright: reportMissingModuleSource=false
from algopy import (
    Asset,
    Global,
    Txn,
    UInt64,
    arc4,
    gtxn,
    itxn,
)

"""
NftMarketplace 앱 설명

이 간단한 NftMarketplace 앱은 에섯(ASA)를 판매할 수 있는 스마트 계약입니다.

이 앱의 lifecycle은 아래와 같습니다.
1. 앱 생성자(판매자)가 앱을 생성합니다.
2. 앱 생성자(판매자)가 앱을 부트스트랩 메서드를 호출해 부트스트랩합니다. 이때 앱은 판매할
   에셋(ASA)을 설정하고, 단가를 설정하고, 앱 계정이 옵트인을 합니다.
3. 구매자가 앱에서 판매하는 에셋(ASA)을 buy메서드를 호출해 구매합니다.
4. 앱 생성자(판매자)가 withdraw_and_delete 메서드를 호출해 앱 계정에 남아있는
   에셋(ASA)을 앱 계정으로 전송하고, 모든 수익금을 판매자 계정으로 송금한 뒤,
   스마트 계약을 삭제합니다.

번외: set_price 메서드를 통해 판매할 에셋(ASA)의 단가를 변경할 수 있습니다.
"""


class NftMarketplace(arc4.ARC4Contract):
    """
    문제 1
    NftMarketplace 앱의 상태를 구현하세요.

    NftMarketplace 앱은 세개의 상태를 가지고 있습니다.
    1. asset_id: 판매할 에셋(ASA)의 아이디; UInt64타입을 가진 글로벌 상태(Global State)
    2. unitary_price: 판매할 에셋(ASA)의 가격. UInt64타입을 가진 글로벌 상태(Global State)
    3. bootstrapped: 앱에서 에셋을 판매할 준비가 되었는지 체크하는 bool 타입의 글로벌 상태(Global State).
       bootstrap 메서드가 실행되면 True로 변경됩니다.

    재밌는 팩트!
    AVM은 Bytes 타입과 UInt64 타입만 지원합니다. 그래서 다른 타입을 사용하고 싶으면 보통 arc4타입을 사용합니다. 하지만
    Algorand Python에서는 bool, string 타입은 파이썬 코드와 동일하게 사용할 수 있습니다. 예를 들어 bool 타입은 True,
    False로 표헌하면 되고, string 타입은 "Hello, World!"와 같이 표현하면 됩니다. Algorand Python에서 데이터 타입을
    사용하는 방법은 아래 링크를 참고해주세요.
    - arc4 타입: https://algorandfoundation.github.io/puya/lg-types.html#types

    힌트 1 - 글러벌 상태: https://algorandfoundation.github.io/puya/lg-storage.html#global-storage
    힌트 2 - 코드 예시: https://github.com/algorandfoundation/puya/blob/11843f6bc4bb6e4c56ac53e3980f74df69d07397/examples/global_state/contract.py#L5
    """

    def __init__(self) -> None:
        self.asset_id = UInt64(0)
        self.unitary_price = UInt64(0)
        self.bootstrapped = False

    """
    문제 2
    bootstrap 메서드를 구현하세요.

    bootstrap 메서드는 앱이 판매할 에셋(ASA)을 설정하고, 단가를 설정하고 에셋이 앱 계정이 옵트인 하는 메서드입니다.
    즉 앱이 판매할 준비를 하는 메서드입니다.

    bootstrap 메서드는 호출 시 아래 사항들을 만족해야 합니다.
    1. 메서드 호출자가 앱의 생성자인지 체크해야합니다.
    2. 앱 계정이 판매할 ASA에 옵트인이 안되어 있는 것을 체크해야합니다. 옵트인이 되어있다면 이미
       부트스트랩이 된 상태입니다.
    3. mbr_pay가 앱 계정으로 보내진 것을 체크해야합니다. 이는 앱 계정의 미니멈 밸런스를 채우기
       위한 payment 트랜잭션입니다.
    4. mbr_pay의 알고 송금량이 앱 계정의 미니멈 밸런스(0.1 알고)와 판매할 ASA에 옵트인하기
       위한 미니멈 밸런스(0.1 알고)의 합과 같은지 체크해야합니다.
    - 팁: Global이라는 AVM opcode를 통해 여러 정보를 열람할 수 있습니다. 자세한 사항은 아래 힌트 1을 참고해주세요.

    bootstrap 메서드는 아래 기능들을 수행합니다.
    1. asset_id 글로벌 상태를 판매할 ASA 아이디로 업데이트합니다.
    2. unitary_price 글로벌 상태를 판매할 ASA의 단가로 업데이트합니다.
    3. bootstrapped 글로벌 상태를 True로 변경합니다.
    4. 앱이 판매할 ASA를 보유할 수 있도록 앱 계정으로 판매할 ASA에 옵트인합니다. 이때 앱 계정이
       트랜잭션을 보내는 것이기 때문에 Inner Transaction을 사용해야합니다. 자세한 사항은 힌트
       2를 참고해주세요.

    힌트 1 - Global: https://algorandfoundation.github.io/puya/api-algopy.html#algopy.Global
    힌트 2 - Inner Transaction: https://algorandfoundation.github.io/puya/lg-transactions.html#inner-transactions
    """

    @arc4.abimethod
    def bootstrap(
        self, asset: Asset, unitary_price: UInt64, mbr_pay: gtxn.PaymentTransaction
    ) -> None:
        assert Txn.sender == Global.creator_address
        assert not Global.current_application_address.is_opted_in(Asset(self.asset_id))

        assert mbr_pay.receiver == Global.current_application_address
        assert mbr_pay.amount == Global.min_balance + Global.asset_opt_in_min_balance
        assert not self.bootstrapped

        self.asset_id = asset.id
        self.unitary_price = unitary_price
        self.bootstrapped = True

        itxn.AssetTransfer(
            xfer_asset=asset,
            asset_receiver=Global.current_application_address,
            asset_amount=0,
        ).submit()

    """
    문제 3
    buy 메서드를 구현하세요.

    buy 메서드는 앱에서 판매하는 에셋(ASA)을 구매할때 구매자가 호출하는 메서드입니다.

    buy 메서드는 호출 시 아래 사항들을 만족해야 합니다.
    1. unitary_price 글로벌 상태가 0이 아닌지 체크해야합니다. 0이라면 부트스트랩이 안된 상태입니다.
    2. buyer_txn의 sender가 Txn.sender와 같은지 체크해야합니다.
       즉 buy 메서드를 호출한 계정과 payment 트랜잭션을 보낸 계정이 동일한지 체크합니다.
    3. buyer_txn의 receiver가 앱 계정 주소와 같은지 체크해야합니다.
       즉 buy 메서드를 호출한 계정이 앱 계정에게 지불하는지 체크합니다.
    4. buyer_txn의 amount가 unitary_price(단가) 곱하기 quantity(수량)과 같은지 체크해야합니다.
       즉 구매자가 지불한 금액이 정확한지 체크합니다.

    buy 메서드는 아래 기능들을 수행합니다.
    1. 구매자에게 에셋(ASA)을 전송합니다. 이때 에셋의 수량은 quantity 전달값만큼 보냅니다.
       이 또한 앱계정이 보내는 트랜잭션이니 Inner Transaction을 사용하세요!

    힌트 1 - Inner Transaction: https://algorandfoundation.github.io/puya/lg-transactions.html#inner-transactions
    """

    @arc4.abimethod
    def buy(
        self,
        buyer_txn: gtxn.PaymentTransaction,
        quantity: UInt64,
    ) -> None:
        assert self.unitary_price != UInt64(0)
        assert buyer_txn.sender == Txn.sender
        assert buyer_txn.receiver == Global.current_application_address
        assert buyer_txn.amount == self.unitary_price * quantity

        itxn.AssetTransfer(
            xfer_asset=self.asset_id,
            asset_receiver=Txn.sender,
            asset_amount=quantity,
        ).submit()

    """
    문제 4
    withdraw_and_delete 메서드를 구현하세요.

    withdraw_and_delete 메서드는 앱 계정에 있는 잔여 에셋(ASA)을 앱 계정으로 전송하고,
    모든 수익금을 판매자 계정으로 송금한 뒤,
    스마트 계약을 삭제하는 메서드입니다.

    withdraw_and_delete 메서드는 OnComplete Action이 DeleteApplication인 메서드입니다.
    즉, 이 메서드가 실행되고 난 후 스마트 계약이 삭제되게 됩니다. 따라서 이 메서드의 Decorator가
    다르게 설정되어야합니다.

    힌트 - Decorator: https://algorandfoundation.github.io/puya/lg-arc4.html#:~:text=%40arc4.abimethod(create%3DFalse%2C%20allow_actions%3D%5B%22NoOp%22%2C%20%22OptIn%22%5D%2C%20name%3D%22external_name%22)

    withdraw_and_delete 메서드는 호출 시 아래 사항들을 만족해야 합니다.
    1. 메서드 호출자가 앱의 생성자인지 체크해야합니다.

    withdraw_and_delete 메서드는 아래 기능들을 수행합니다.
    1. 앱 계정에 있는 에셋(ASA)을 앱 계정으로 전송합니다.
       이때 asset_close_to 패러미터를 앱 생성자(판매자)로 설정하여
       앱 계정에 남아있는 에섯 전부를 앱 생성자(판매자)에게 보냅니다.
       에셋의 수량과 무관하게 전량 송금되기 때문에 에셋 수량은 상관 없습니다.

    2. 앱 계정에 있는 모든 수익금을 앱 생성자(판매자) 계정으로 송금합니다.
       이때 close_remainder_to 패러미터를 앱 생성자(판매자)로 설정하여 알고 전액(미니멈 밸런스 포함)을 앱
       생성자(판매자)에게 보냅니다.close_remainder_to가 설정되어있기 때문에 amount와 상관없이 알고 전액이 송금됩니다.

    이때 두 트랜잭션 다 앱 계정이 보내는 트랜잭션이기 때문에 Inner Transaction을 사용하세요!
    """

    @arc4.abimethod(allow_actions=["DeleteApplication"])
    def withdraw_and_delete(self) -> UInt64:
        assert Txn.sender == Global.creator_address
        contract_balance = Global.current_application_address.balance

        itxn.AssetTransfer(
            xfer_asset=self.asset_id,
            asset_receiver=Global.creator_address,
            asset_close_to=Global.creator_address,
        ).submit()

        itxn.Payment(
            receiver=Global.creator_address,
            close_remainder_to=Global.creator_address,
        ).submit()

        return contract_balance
