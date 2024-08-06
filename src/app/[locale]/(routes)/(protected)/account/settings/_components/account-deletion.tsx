'use client'

import { deleteUser } from '@/actions/user/delete-user'
import { logout } from '@/actions/user/logout'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'
import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

const AccountDeletion = () => {
  const showModal = useModalStore((state) => state.showModal)
  const { toast } = useToast()
  const t = useTranslations()

  const handleDeleteUser = async () => {
    const data = await deleteUser()
    if (data?.error) {
      toast({
        title: data.error,
        variant: 'destructive',
      })
    } else {
      await logout()
      toast({
        title: 'Your account has been successfully deleted',
        variant: 'success',
      })
    }
  }

  const showConfirmModal = () => {
    showModal(ModalTypeEnum.CONFIRMATION, {
      title: 'Are you absolutely sure?',
      description:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      onConfirm: handleDeleteUser,
      loadingText: 'Deletion...',
    })
  }

  return (
    <div>
      <h6>{t('settings.account_deletion')}</h6>
      <p className='mt-1 text-sm text-neutral-400'>{t('settings.account_deletion_desc')}</p>
      <Button size={'sm'} variant={'outline-destructive'} className='mt-4' onClick={showConfirmModal}>
        <Trash />
        {t('buttons.delete_account')}
      </Button>
    </div>
  )
}

export default AccountDeletion
