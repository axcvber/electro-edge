'use client'

import React from 'react'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { Button } from '../ui/button'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { MenuItem } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'

interface ICatalogButton {
  catalogMenu: MenuItem[]
  onClick?: () => void
}

const CatalogButton: React.FC<ICatalogButton> = ({ catalogMenu, onClick }) => {
  const showModal = useModalStore((state) => state.showModal)
  const t = useTranslations('buttons')

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    showModal(ModalTypeEnum.CATALOG, { catalogMenu })
  }

  return (
    <Button variant={'secondary'} className='lg:rounded-e-none' onClick={handleClick}>
      <LayoutGrid />
      {t('catalog')}
      <ChevronDown />
    </Button>
  )
}

export default CatalogButton
