import { useState } from 'react'
import Transact from './Transact'

export function TransactSection() {
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => {
    setOpenModal(!openModal)
  }

  return (
    <section>
      <button className="rounded-lg px-4 py-2 bg-teal-700 text-white font-bold" onClick={toggleModal}>
        Transact
      </button>
      <Transact openModal={openModal} setModalState={setOpenModal} />
    </section>
  )
}
