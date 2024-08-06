'use client'

import React, { useEffect } from 'react'
import CartModal from '@/components/modals/cart-modal'
import useModalStore from '@/store/use-modal-store'
import LoginModal from '@/components/modals/login-modal'
import RegisterModal from '@/components/modals/register-modal'
import SearchModal from '@/components/modals/search-modal'
import ResetPassModal from '@/components/modals/reset-pass-modal'
import AddAddressModal from '@/components/modals/add-address-modal'
import EditAddressModal, { EditAddressModalProps } from '@/components/modals/edit-address-modal'
import CatalogModal, { CatalogModalProps } from '@/components/modals/catalog-modal'
import ConfirmationModal, { ConfirmModalProps } from '@/components/modals/confirmation-modal'
import { usePathname } from 'next/navigation'

export enum ModalTypeEnum {
  CART = 'CART',
  CATALOG = 'CATALOG',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASS = 'RESET_PASS',
  SEARCH = 'SEARCH',
  ADD_ADDRESS = 'ADD_ADDRESS',
  EDIT_ADDRESS = 'EDIT_ADDRESS',
  CONFIRMATION = 'CONFIRMATION',
}

export type ModalData = {
  [ModalTypeEnum.CONFIRMATION]: ConfirmModalProps
  [ModalTypeEnum.EDIT_ADDRESS]: EditAddressModalProps
  [ModalTypeEnum.CATALOG]: CatalogModalProps
}

const MODAL_COMPONENTS = {
  [ModalTypeEnum.CART]: CartModal,
  [ModalTypeEnum.CATALOG]: CatalogModal,
  [ModalTypeEnum.LOGIN]: LoginModal,
  [ModalTypeEnum.REGISTER]: RegisterModal,
  [ModalTypeEnum.RESET_PASS]: ResetPassModal,
  [ModalTypeEnum.SEARCH]: SearchModal,
  [ModalTypeEnum.ADD_ADDRESS]: AddAddressModal,
  [ModalTypeEnum.EDIT_ADDRESS]: EditAddressModal,
  [ModalTypeEnum.CONFIRMATION]: ConfirmationModal,
}

const renderComponent = (type: ModalTypeEnum | null, data: any) => {
  const ModalComponent = type ? MODAL_COMPONENTS[type] : null
  return ModalComponent ? <ModalComponent {...data} /> : null
}

const ModalProvider = () => {
  const type = useModalStore((state) => state.type)
  const data = useModalStore((state) => state.data)
  const hideModal = useModalStore((state) => state.hideModal)
  const pathname = usePathname()

  useEffect(() => {
    hideModal()
  }, [pathname])

  return <>{renderComponent(type, data)}</>
}

export default ModalProvider
