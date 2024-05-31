/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  ABIAppCallArg,
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  AppCompilationResult,
  AppReference,
  AppState,
  AppStorageSchema,
  CoreAppCallArgs,
  RawAppCallArgs,
  TealTemplateParams,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom, SendTransactionParams } from '@algorandfoundation/algokit-utils/types/transaction'
import type { ABIResult, TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer, modelsv2 } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "opt_in_to_app()void": {
      "call_config": {
        "opt_in": "CALL"
      }
    },
    "deposit(pay)uint64": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "withdraw()uint64": {
      "call_config": {
        "close_out": "CALL"
      }
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpzbWFydF9jb250cmFjdHMucGVyc29uYWxfYmFuay5jb250cmFjdC5QZXJzb25hbEJhbmsuYXBwcm92YWxfcHJvZ3JhbToKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBibnogbWFpbl9lbnRyeXBvaW50QDIKICAgIGNhbGxzdWIgX19pbml0X18KCm1haW5fZW50cnlwb2ludEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6NAogICAgLy8gY2xhc3MgUGVyc29uYWxCYW5rKEFSQzRDb250cmFjdCk6CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9iYXJlX3JvdXRpbmdAOQogICAgbWV0aG9kICJvcHRfaW5fdG9fYXBwKCl2b2lkIgogICAgbWV0aG9kICJkZXBvc2l0KHBheSl1aW50NjQiCiAgICBtZXRob2QgIndpdGhkcmF3KCl1aW50NjQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX29wdF9pbl90b19hcHBfcm91dGVANCBtYWluX2RlcG9zaXRfcm91dGVANSBtYWluX3dpdGhkcmF3X3JvdXRlQDYKICAgIGVyciAvLyByZWplY3QgdHJhbnNhY3Rpb24KCm1haW5fb3B0X2luX3RvX2FwcF9yb3V0ZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTAKICAgIC8vIEBhcmM0LmFiaW1ldGhvZChhbGxvd19hY3Rpb25zPVsiT3B0SW4iXSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIGludCBPcHRJbgogICAgPT0KICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgT3B0SW4KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gaXMgbm90IGNyZWF0aW5nCiAgICBjYWxsc3ViIG9wdF9pbl90b19hcHAKICAgIGludCAxCiAgICByZXR1cm4KCm1haW5fZGVwb3NpdF9yb3V0ZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTkKICAgIC8vIEBhcmM0LmFiaW1ldGhvZAogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGlzIG5vdCBjcmVhdGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6NAogICAgLy8gY2xhc3MgUGVyc29uYWxCYW5rKEFSQzRDb250cmFjdCk6CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50IDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludCBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjE5CiAgICAvLyBAYXJjNC5hYmltZXRob2QKICAgIGNhbGxzdWIgZGVwb3NpdAogICAgaXRvYgogICAgYnl0ZSAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50IDEKICAgIHJldHVybgoKbWFpbl93aXRoZHJhd19yb3V0ZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MzUKICAgIC8vIEBhcmM0LmFiaW1ldGhvZChhbGxvd19hY3Rpb25zPVsiQ2xvc2VPdXQiXSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIGludCBDbG9zZU91dAogICAgPT0KICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgQ2xvc2VPdXQKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gaXMgbm90IGNyZWF0aW5nCiAgICBjYWxsc3ViIHdpdGhkcmF3CiAgICBpdG9iCiAgICBieXRlIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnQgMQogICAgcmV0dXJuCgptYWluX2JhcmVfcm91dGluZ0A5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6NAogICAgLy8gY2xhc3MgUGVyc29uYWxCYW5rKEFSQzRDb250cmFjdCk6CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gcmVqZWN0IHRyYW5zYWN0aW9uCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgYXNzZXJ0IC8vIGlzIGNyZWF0aW5nCiAgICBpbnQgMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzLnBlcnNvbmFsX2JhbmsuY29udHJhY3QuUGVyc29uYWxCYW5rLm9wdF9pbl90b19hcHAoKSAtPiB2b2lkOgpvcHRfaW5fdG9fYXBwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTAtMTEKICAgIC8vIEBhcmM0LmFiaW1ldGhvZChhbGxvd19hY3Rpb25zPVsiT3B0SW4iXSkKICAgIC8vIGRlZiBvcHRfaW5fdG9fYXBwKHNlbGYpIC0+IE5vbmU6CiAgICBwcm90byAwIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjEyCiAgICAvLyByZXN1bHQsIGV4aXN0cyA9IHNlbGYub3B0ZWRJbi5tYXliZShUeG4uc2VuZGVyKQogICAgdHhuIFNlbmRlcgogICAgaW50IDAKICAgIGJ5dGUgIm9wdGVkSW4iCiAgICBhcHBfbG9jYWxfZ2V0X2V4CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjEzCiAgICAvLyBhc3NlcnQgbm90IGV4aXN0cywgIlVzZXIgYWxyZWFkeSBvcHRlZCBpbiIKICAgICEKICAgIGFzc2VydCAvLyBVc2VyIGFscmVhZHkgb3B0ZWQgaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjE1CiAgICAvLyBzZWxmLmJhbGFuY2VbVHhuLnNlbmRlcl0gPSBVSW50NjQoMCkKICAgIHR4biBTZW5kZXIKICAgIGJ5dGUgImJhbGFuY2UiCiAgICBpbnQgMAogICAgYXBwX2xvY2FsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTYKICAgIC8vIHNlbGYub3B0ZWRJbltUeG4uc2VuZGVyXSA9IFRydWUKICAgIHR4biBTZW5kZXIKICAgIGJ5dGUgIm9wdGVkSW4iCiAgICBpbnQgMQogICAgYXBwX2xvY2FsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTcKICAgIC8vIHNlbGYuZGVwb3NpdG9ycyArPSAxCiAgICBpbnQgMAogICAgYnl0ZSAiZGVwb3NpdG9ycyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgZGVwb3NpdG9ycyBleGlzdHMKICAgIGludCAxCiAgICArCiAgICBieXRlICJkZXBvc2l0b3JzIgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy5wZXJzb25hbF9iYW5rLmNvbnRyYWN0LlBlcnNvbmFsQmFuay5kZXBvc2l0KHB0eG46IHVpbnQ2NCkgLT4gdWludDY0OgpkZXBvc2l0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MTktMjAKICAgIC8vIEBhcmM0LmFiaW1ldGhvZAogICAgLy8gZGVmIGRlcG9zaXQoc2VsZiwgcHR4bjogZ3R4bi5QYXltZW50VHJhbnNhY3Rpb24pIC0+IFVJbnQ2NDoKICAgIHByb3RvIDEgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MjEKICAgIC8vIGFzc2VydCBwdHhuLmFtb3VudCA+IDAsICJEZXBvc2l0IGFtb3VudCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIgogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBBbW91bnQKICAgIGR1cAogICAgYXNzZXJ0IC8vIERlcG9zaXQgYW1vdW50IG11c3QgYmUgZ3JlYXRlciB0aGFuIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjIzCiAgICAvLyBwdHhuLnJlY2VpdmVyID09IEdsb2JhbC5jdXJyZW50X2FwcGxpY2F0aW9uX2FkZHJlc3MKICAgIGZyYW1lX2RpZyAtMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MjItMjQKICAgIC8vIGFzc2VydCAoCiAgICAvLyAgICAgcHR4bi5yZWNlaXZlciA9PSBHbG9iYWwuY3VycmVudF9hcHBsaWNhdGlvbl9hZGRyZXNzCiAgICAvLyApLCAiRGVwb3NpdCByZWNlaXZlciBtdXN0IGJlIHRoZSBjb250cmFjdCBhZGRyZXNzIgogICAgYXNzZXJ0IC8vIERlcG9zaXQgcmVjZWl2ZXIgbXVzdCBiZSB0aGUgY29udHJhY3QgYWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MjUKICAgIC8vIGFzc2VydCBwdHhuLnNlbmRlciA9PSBUeG4uc2VuZGVyLCAiRGVwb3NpdCBzZW5kZXIgbXVzdCBiZSB0aGUgY2FsbGVyIgogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBTZW5kZXIKICAgIHR4biBTZW5kZXIKICAgID09CiAgICBhc3NlcnQgLy8gRGVwb3NpdCBzZW5kZXIgbXVzdCBiZSB0aGUgY2FsbGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weToyNgogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIuaXNfb3B0ZWRfaW4oCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weToyNwogICAgLy8gR2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25faWQKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MjYtMjgKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyLmlzX29wdGVkX2luKAogICAgLy8gICAgIEdsb2JhbC5jdXJyZW50X2FwcGxpY2F0aW9uX2lkCiAgICAvLyApLCAiRGVwb3NpdCBzZW5kZXIgbXVzdCBvcHQtaW4gdG8gdGhlIGFwcCBmaXJzdC4iCiAgICBhcHBfb3B0ZWRfaW4KICAgIGFzc2VydCAvLyBEZXBvc2l0IHNlbmRlciBtdXN0IG9wdC1pbiB0byB0aGUgYXBwIGZpcnN0LgogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6MzAKICAgIC8vIHNlbGYuYmFsYW5jZVtUeG4uc2VuZGVyXSArPSBwdHhuLmFtb3VudAogICAgdHhuIFNlbmRlcgogICAgaW50IDAKICAgIGJ5dGUgImJhbGFuY2UiCiAgICBhcHBfbG9jYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgYmFsYW5jZSBleGlzdHMgZm9yIGFjY291bnQKICAgICsKICAgIHR4biBTZW5kZXIKICAgIGJ5dGUgImJhbGFuY2UiCiAgICB1bmNvdmVyIDIKICAgIGFwcF9sb2NhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjMxCiAgICAvLyB1c2VyX2JhbGFuY2UgPSBzZWxmLmJhbGFuY2VbVHhuLnNlbmRlcl0KICAgIHR4biBTZW5kZXIKICAgIGludCAwCiAgICBieXRlICJiYWxhbmNlIgogICAgYXBwX2xvY2FsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIGJhbGFuY2UgZXhpc3RzIGZvciBhY2NvdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTozMwogICAgLy8gcmV0dXJuIHVzZXJfYmFsYW5jZQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnBlcnNvbmFsX2JhbmsuY29udHJhY3QuUGVyc29uYWxCYW5rLndpdGhkcmF3KCkgLT4gdWludDY0Ogp3aXRoZHJhdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjM1LTM2CiAgICAvLyBAYXJjNC5hYmltZXRob2QoYWxsb3dfYWN0aW9ucz1bIkNsb3NlT3V0Il0pCiAgICAvLyBkZWYgd2l0aGRyYXcoc2VsZikgLT4gVUludDY0OgogICAgcHJvdG8gMCAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTozNwogICAgLy8gYXNzZXJ0IHNlbGYuYmFsYW5jZVtUeG4uc2VuZGVyXSA+IDAsICJVc2VyIGJhbGFuY2UgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCIKICAgIHR4biBTZW5kZXIKICAgIGludCAwCiAgICBieXRlICJiYWxhbmNlIgogICAgYXBwX2xvY2FsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIGJhbGFuY2UgZXhpc3RzIGZvciBhY2NvdW50CiAgICBhc3NlcnQgLy8gVXNlciBiYWxhbmNlIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjM5CiAgICAvLyB1c2VyQmFsYW5jZSA9IHNlbGYuYmFsYW5jZVtUeG4uc2VuZGVyXQogICAgdHhuIFNlbmRlcgogICAgaW50IDAKICAgIGJ5dGUgImJhbGFuY2UiCiAgICBhcHBfbG9jYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgYmFsYW5jZSBleGlzdHMgZm9yIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjQxLTQ2CiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9VHhuLnNlbmRlciwKICAgIC8vICAgICBzZW5kZXI9R2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25fYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ9dXNlckJhbGFuY2UsCiAgICAvLyAgICAgZmVlPTAsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTo0MgogICAgLy8gcmVjZWl2ZXI9VHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjQzCiAgICAvLyBzZW5kZXI9R2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25fYWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBkaWcgMgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTo0MQogICAgLy8gaXR4bi5QYXltZW50KAogICAgaW50IHBheQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3BlcnNvbmFsX2JhbmsvY29udHJhY3QucHk6NDUKICAgIC8vIGZlZT0wLAogICAgaW50IDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTo0MS00NgogICAgLy8gaXR4bi5QYXltZW50KAogICAgLy8gICAgIHJlY2VpdmVyPVR4bi5zZW5kZXIsCiAgICAvLyAgICAgc2VuZGVyPUdsb2JhbC5jdXJyZW50X2FwcGxpY2F0aW9uX2FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50PXVzZXJCYWxhbmNlLAogICAgLy8gICAgIGZlZT0wLAogICAgLy8gKS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjQ4CiAgICAvLyBzZWxmLmRlcG9zaXRvcnMgLT0gMQogICAgaW50IDAKICAgIGJ5dGUgImRlcG9zaXRvcnMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIGRlcG9zaXRvcnMgZXhpc3RzCiAgICBpbnQgMQogICAgLQogICAgYnl0ZSAiZGVwb3NpdG9ycyIKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTo1MAogICAgLy8gcmV0dXJuIHVzZXJCYWxhbmNlCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMucGVyc29uYWxfYmFuay5jb250cmFjdC5QZXJzb25hbEJhbmsuX19pbml0X18oKSAtPiB2b2lkOgpfX2luaXRfXzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjUKICAgIC8vIGRlZiBfX2luaXRfXyhzZWxmKSAtPiBOb25lOgogICAgcHJvdG8gMCAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcGVyc29uYWxfYmFuay9jb250cmFjdC5weTo4CiAgICAvLyBzZWxmLmRlcG9zaXRvcnMgPSBVSW50NjQoMCkKICAgIGJ5dGUgImRlcG9zaXRvcnMiCiAgICBpbnQgMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1Ygo=",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpzbWFydF9jb250cmFjdHMucGVyc29uYWxfYmFuay5jb250cmFjdC5QZXJzb25hbEJhbmsuY2xlYXJfc3RhdGVfcHJvZ3JhbToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9wZXJzb25hbF9iYW5rL2NvbnRyYWN0LnB5OjQKICAgIC8vIGNsYXNzIFBlcnNvbmFsQmFuayhBUkM0Q29udHJhY3QpOgogICAgaW50IDEKICAgIHJldHVybgo="
  },
  "state": {
    "global": {
      "num_byte_slices": 0,
      "num_uints": 1
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 2
    }
  },
  "schema": {
    "global": {
      "declared": {
        "depositors": {
          "type": "uint64",
          "key": "depositors"
        }
      },
      "reserved": {}
    },
    "local": {
      "declared": {
        "balance": {
          "type": "uint64",
          "key": "balance"
        },
        "optedIn": {
          "type": "uint64",
          "key": "optedIn"
        }
      },
      "reserved": {}
    }
  },
  "contract": {
    "name": "PersonalBank",
    "methods": [
      {
        "name": "opt_in_to_app",
        "args": [],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "deposit",
        "args": [
          {
            "type": "pay",
            "name": "ptxn"
          }
        ],
        "returns": {
          "type": "uint64"
        }
      },
      {
        "name": "withdraw",
        "args": [],
        "returns": {
          "type": "uint64"
        }
      }
    ],
    "networks": {}
  },
  "bare_call_config": {
    "no_op": "CREATE"
  }
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt.
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

export type AppCreateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult> & AppReference
export type AppUpdateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult>

export type AppClientComposeCallCoreParams = Omit<AppClientCallCoreParams, 'sendParams'> & {
  sendParams?: Omit<SendTransactionParams, 'skipSending' | 'atc' | 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources'>
}
export type AppClientComposeExecuteParams = Pick<SendTransactionParams, 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources' | 'suppressLog'>

export type IncludeSchema = {
  /**
   * Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.
   */
  schema?: Partial<AppStorageSchema>
}

/**
 * Defines the types of available calls and state of the PersonalBank smart contract.
 */
export type PersonalBank = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'opt_in_to_app()void' | 'opt_in_to_app', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
    & Record<'deposit(pay)uint64' | 'deposit', {
      argsObj: {
        ptxn: TransactionToSign | Transaction | Promise<SendTransactionResult>
      }
      argsTuple: [ptxn: TransactionToSign | Transaction | Promise<SendTransactionResult>]
      returns: bigint
    }>
    & Record<'withdraw()uint64' | 'withdraw', {
      argsObj: {
      }
      argsTuple: []
      returns: bigint
    }>
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    global: {
      depositors?: IntegerState
    }
    local: {
      balance?: IntegerState
      optedIn?: IntegerState
    }
  }
}
/**
 * Defines the possible abi call signatures
 */
export type PersonalBankSig = keyof PersonalBank['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends PersonalBankSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the PersonalBank smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends PersonalBankSig> = PersonalBank['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the PersonalBank smart contract to the method's return type
 */
export type MethodReturn<TSignature extends PersonalBankSig> = PersonalBank['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type PersonalBankCreateCalls = (typeof PersonalBankCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type PersonalBankCreateCallParams =
  | (TypedCallParams<undefined> & (OnCompleteNoOp))
/**
 * Defines arguments required for the deploy method.
 */
export type PersonalBankDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: PersonalBankCreateCalls) => PersonalBankCreateCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class PersonalBankCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the PersonalBank smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available optIn call factories
   */
  static get optIn() {
    return {
      /**
       * Constructs an opt in call for the PersonalBank smart contract using the opt_in_to_app()void ABI method
       *
       * @param args Any args for the contract call
       * @param params Any additional parameters for the call
       * @returns A TypedCallParams object for the call
       */
      optInToApp(args: MethodArgs<'opt_in_to_app()void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return {
          method: 'opt_in_to_app()void' as const,
          methodArgs: Array.isArray(args) ? args : [],
          ...params,
        }
      },
    }
  }

  /**
   * Gets available closeOut call factories
   */
  static get closeOut() {
    return {
      /**
       * Constructs a close out call for the PersonalBank smart contract using the withdraw()uint64 ABI method
       *
       * @param args Any args for the contract call
       * @param params Any additional parameters for the call
       * @returns A TypedCallParams object for the call
       */
      withdraw(args: MethodArgs<'withdraw()uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return {
          method: 'withdraw()uint64' as const,
          methodArgs: Array.isArray(args) ? args : [],
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the deposit(pay)uint64 ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static deposit(args: MethodArgs<'deposit(pay)uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'deposit(pay)uint64' as const,
      methodArgs: Array.isArray(args) ? args : [args.ptxn],
      ...params,
    }
  }
}

/**
 * A client to make calls to the PersonalBank smart contract
 */
export class PersonalBankClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `PersonalBankClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn, TResult extends AppCallTransactionResult = AppCallTransactionResult>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> & TResult {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue } as AppCallTransactionResultOfType<TReturn> & TResult
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof PersonalBank['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the PersonalBank smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: PersonalBankDeployArgs & AppClientDeployCoreParams & IncludeSchema = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(PersonalBankCallFactory.create)
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the PersonalBank smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      async bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & IncludeSchema & CoreAppCallArgs & (OnCompleteNoOp) = {}) {
        return $this.mapReturnValue<undefined, AppCreateCallTransactionResult>(await $this.appClient.create(args))
      },
    }
  }

  /**
   * Gets available optIn methods
   */
  public get optIn() {
    const $this = this
    return {
      /**
       * Opts the user into an existing instance of the PersonalBank smart contract using the opt_in_to_app()void ABI method.
       *
       * @param args The arguments for the smart contract call
       * @param params Any additional parameters for the call
       * @returns The optIn result
       */
      async optInToApp(args: MethodArgs<'opt_in_to_app()void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return $this.mapReturnValue<MethodReturn<'opt_in_to_app()void'>>(await $this.appClient.optIn(PersonalBankCallFactory.optIn.optInToApp(args, params)))
      },
    }
  }

  /**
   * Gets available closeOut methods
   */
  public get closeOut() {
    const $this = this
    return {
      /**
       * Makes a close out call to an existing instance of the PersonalBank smart contract using the withdraw()uint64 ABI method.
       *
       * @param args The arguments for the smart contract call
       * @param params Any additional parameters for the call
       * @returns The closeOut result
       */
      async withdraw(args: MethodArgs<'withdraw()uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return $this.mapReturnValue<MethodReturn<'withdraw()uint64'>>(await $this.appClient.closeOut(PersonalBankCallFactory.closeOut.withdraw(args, params)))
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the PersonalBank smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the deposit(pay)uint64 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public deposit(args: MethodArgs<'deposit(pay)uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(PersonalBankCallFactory.deposit(args, params))
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(state: AppState, key: string): BinaryState | undefined {
    const value = state[key]
    if (!value) return undefined
    if (!('valueRaw' in value))
      throw new Error(`Failed to parse state value for ${key}; received an int when expected a byte array`)
    return {
      asString(): string {
        return value.value
      },
      asByteArray(): Uint8Array {
        return value.valueRaw
      }
    }
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(state: AppState, key: string): IntegerState | undefined {
    const value = state[key]
    if (!value) return undefined
    if ('valueRaw' in value)
      throw new Error(`Failed to parse state value for ${key}; received a byte array when expected a number`)
    return {
      asBigInt() {
        return typeof value.value === 'bigint' ? value.value : BigInt(value.value)
      },
      asNumber(): number {
        return typeof value.value === 'bigint' ? Number(value.value) : value.value
      },
    }
  }

  /**
   * Returns the smart contract's global state wrapped in a strongly typed accessor with options to format the stored value
   */
  public async getGlobalState(): Promise<PersonalBank['state']['global']> {
    const state = await this.appClient.getGlobalState()
    return {
      get depositors() {
        return PersonalBankClient.getIntegerState(state, 'depositors')
      },
    }
  }

  /**
   * Returns the smart contract's local state wrapped in a strongly typed accessor with options to format the stored value
   *
   * @param account The address of the account for which to read local state from
   */
  public async getLocalState(account: string | SendTransactionFrom): Promise<PersonalBank['state']['local']> {
    const state = await this.appClient.getLocalState(account)
    return {
      get balance() {
        return PersonalBankClient.getIntegerState(state, 'balance')
      },
      get optedIn() {
        return PersonalBankClient.getIntegerState(state, 'optedIn')
      },
    }
  }

  public compose(): PersonalBankComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      deposit(args: MethodArgs<'deposit(pay)uint64'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.deposit(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      get optIn() {
        const $this = this
        return {
          optInToApp(args: MethodArgs<'opt_in_to_app()void'>, params?: AppClientComposeCallCoreParams) {
            promiseChain = promiseChain.then(() => client.optIn.optInToApp(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      get closeOut() {
        const $this = this
        return {
          withdraw(args: MethodArgs<'withdraw()uint64'>, params?: AppClientComposeCallCoreParams) {
            promiseChain = promiseChain.then(() => client.closeOut.withdraw(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async simulate(options?: SimulateOptions) {
        await promiseChain
        const result = await atc.simulate(client.algod, new modelsv2.SimulateRequest({ txnGroups: [], ...options }))
        return {
          ...result,
          returns: result.methodResults?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      },
      async execute(sendParams?: AppClientComposeExecuteParams) {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as PersonalBankComposer
  }
}
export type PersonalBankComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the deposit(pay)uint64 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  deposit(args: MethodArgs<'deposit(pay)uint64'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): PersonalBankComposer<[...TReturns, MethodReturn<'deposit(pay)uint64'>]>

  /**
   * Gets available optIn methods
   */
  readonly optIn: {
    /**
     * Opts the user into an existing instance of the PersonalBank smart contract using the opt_in_to_app()void ABI method.
     *
     * @param args The arguments for the smart contract call
     * @param params Any additional parameters for the call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    optInToApp(args: MethodArgs<'opt_in_to_app()void'>, params?: AppClientComposeCallCoreParams): PersonalBankComposer<[...TReturns, MethodReturn<'opt_in_to_app()void'>]>
  }

  /**
   * Gets available closeOut methods
   */
  readonly closeOut: {
    /**
     * Makes a close out call to an existing instance of the PersonalBank smart contract using the withdraw()uint64 ABI method.
     *
     * @param args The arguments for the smart contract call
     * @param params Any additional parameters for the call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    withdraw(args: MethodArgs<'withdraw()uint64'>, params?: AppClientComposeCallCoreParams): PersonalBankComposer<[...TReturns, MethodReturn<'withdraw()uint64'>]>
  }

  /**
   * Makes a clear_state call to an existing instance of the PersonalBank smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs): PersonalBankComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): PersonalBankComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(options?: SimulateOptions): Promise<PersonalBankComposerSimulateResult<TReturns>>
  /**
   * Executes the transaction group and returns the results
   */
  execute(sendParams?: AppClientComposeExecuteParams): Promise<PersonalBankComposerResults<TReturns>>
}
export type SimulateOptions = Omit<ConstructorParameters<typeof modelsv2.SimulateRequest>[0], 'txnGroups'>
export type PersonalBankComposerSimulateResult<TReturns extends [...any[]]> = {
  returns: TReturns
  methodResults: ABIResult[]
  simulateResponse: modelsv2.SimulateResponse
}
export type PersonalBankComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
