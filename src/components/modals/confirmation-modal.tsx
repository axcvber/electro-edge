'use client'

import React, { useCallback, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '../ui/button'

import useModalStore from '@/store/use-modal-store'

export interface ConfirmModalProps {
  title: string
  description: string
  loadingText?: string
  onConfirm: () => Promise<void>
}

const ConfirmationModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)
  const { title, description, onConfirm, loadingText } = useModalStore((s) => s.data) as ConfirmModalProps
  const [isPending, startTransition] = useTransition()

  const handleActionClick = useCallback(() => {
    if (isPending) return
    startTransition(async () => {
      await onConfirm()
    })
  }, [isPending, onConfirm])

  return (
    <AlertDialog open={isOpen} onOpenChange={hideModal}>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleActionClick} isLoading={isPending} loadingText={loadingText} variant={'destructive'}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationModal
