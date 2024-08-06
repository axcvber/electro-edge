import ProductSearch from '@/components/common/product-search'
import useModalStore from '@/store/use-modal-store'
import { Modal } from '@/components/ui/modal'

const SearchModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-xl h-auto top-20 p-2'>
      <ProductSearch />
    </Modal>
  )
}

export default SearchModal
