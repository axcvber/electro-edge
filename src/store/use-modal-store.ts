'use client'

import { ModalData, ModalTypeEnum } from '@/providers/modal-provider'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type ModalState = {
  type: ModalTypeEnum | null
  data: Partial<ModalData[keyof ModalData]>
  isOpen: boolean
}

type ModalActions = {
  showModal: <T extends ModalTypeEnum>(type: T, data?: T extends keyof ModalData ? ModalData[T] : undefined) => void
  hideModal: () => void
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: {},
}

const useModalStore = create<ModalState & ModalActions>()(
  devtools(
    (set) => ({
      ...initialState,
      showModal: (type, data) => set({ isOpen: true, type, data: data || {} }),
      hideModal: () => {
        set((state) => ({ ...state, isOpen: false }))
        setTimeout(() => {
          set(() => initialState)
        }, 100)
      },
    }),
    { name: 'modal-storage' }
  )
)

export default useModalStore
