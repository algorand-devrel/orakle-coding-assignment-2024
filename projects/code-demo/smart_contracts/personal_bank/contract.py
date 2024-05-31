from algopy import ARC4Contract, LocalState, UInt64, Txn, Global, itxn, gtxn, arc4


class PersonalBank(ARC4Contract):
    def __init__(self) -> None:
        self.balance = LocalState(UInt64)
        self.optedIn = LocalState(bool)
        self.depositors = UInt64(0)

    @arc4.abimethod(allow_actions=["OptIn"])
    def opt_in_to_app(self) -> None:
        result, exists = self.optedIn.maybe(Txn.sender)
        assert not exists, "User already opted in"

        self.balance[Txn.sender] = UInt64(0)
        self.optedIn[Txn.sender] = True
        self.depositors += 1

    @arc4.abimethod
    def deposit(self, ptxn: gtxn.PaymentTransaction) -> UInt64:
        assert ptxn.amount > 0, "Deposit amount must be greater than 0"
        assert (
            ptxn.receiver == Global.current_application_address
        ), "Deposit receiver must be the contract address"
        assert ptxn.sender == Txn.sender, "Deposit sender must be the caller"
        assert Txn.sender.is_opted_in(
            Global.current_application_id
        ), "Deposit sender must opt-in to the app first."

        self.balance[Txn.sender] += ptxn.amount
        user_balance = self.balance[Txn.sender]

        return user_balance

    @arc4.abimethod(allow_actions=["CloseOut"])
    def withdraw(self) -> UInt64:
        assert self.balance[Txn.sender] > 0, "User balance must be greater than 0"

        userBalance = self.balance[Txn.sender]

        itxn.Payment(
            receiver=Txn.sender,
            sender=Global.current_application_address,
            amount=userBalance,
            fee=0,
        ).submit()

        self.depositors -= 1

        return userBalance
