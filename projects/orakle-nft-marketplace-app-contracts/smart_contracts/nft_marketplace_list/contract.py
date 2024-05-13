# pyright: reportMissingModuleSource=false
import typing
from algopy import *

app_id_list: typing.TypeAlias = arc4.DynamicArray[arc4.UInt64]


class NftMarketplaceList(ARC4Contract):

    def __init__(self) -> None:
        self.marketplace_list = app_id_list()

    @arc4.abimethod()
    def add_marketplace_to_list(self, app_id: UInt64) -> app_id_list:
        self.marketplace_list.append(arc4.UInt64(app_id))
        return self.marketplace_list

    @arc4.abimethod()
    def remove_marketplace_from_list(self, app_id: UInt64) -> app_id_list:
        new_list = app_id_list()
        for i in urange(self.marketplace_list.length):
            current_app_id = self.marketplace_list[i]

            if current_app_id != app_id:
                new_list.append(current_app_id)

        self.marketplace_list = new_list.copy()

        return self.marketplace_list

    @arc4.abimethod(readonly=True)
    def read_marketplace_list(self) -> app_id_list:
        return self.marketplace_list
