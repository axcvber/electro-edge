import React from 'react'
import { Modal } from '../ui/modal'
import useModalStore from '@/store/use-modal-store'
import { MenuItem } from '@/gql/storefront/graphql'
import { Button } from '../ui/button'
import Link from 'next/link'
import NextImage from '../ui/next-image'
import { replaceShopifyLink } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

export interface CatalogModalProps {
  catalogMenu: MenuItem[]
}

const CatalogModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)
  const modalData = useModalStore((s) => s.data) as CatalogModalProps

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-2xl p-0 block'>
      <DialogHeader>
        <DialogTitle className='h4'>Catalog</DialogTitle>
      </DialogHeader>
      <div className='grid sm:grid-cols-2 gap-2 h-fit p-4'>
        {modalData.catalogMenu.map((item) => (
          <div key={item.id}>
            <Button variant={'ghost'} asChild className='text-neutral-600 hover:text-primary'>
              <Link href={replaceShopifyLink(item.url)}>
                <NextImage
                  width={20}
                  height={20}
                  //@ts-ignore
                  src={item.resource?.icon?.reference?.image?.url}
                  //@ts-ignore
                  alt={item.resource?.icon?.reference?.image?.altText || ''}
                />
                <p className='font-medium text-xs md:text-sm'>{item.title}</p>
                <ChevronRight />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default CatalogModal
