import ChangePasswordForm from '@/components/forms/change-password-form'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import SubscriptionSwitch from './_components/subscription-switch'
import AccountDeletion from './_components/account-deletion'
import { getTranslations } from 'next-intl/server'

const SettingsPage = async () => {
  const t = await getTranslations('settings')
  return (
    <div className='space-y-8'>
      <div className='space-y-1'>
        <h1 className='h3'>{t('title')}</h1>
        <p className='text-neutral-400'>{t('desc')}</p>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-5 items-center'>
        <div>
          <h6>{t('newsletter')}</h6>
          <p className='mt-1 mb-2 text-sm text-neutral-400'>{t('newsletter_desc')}</p>
        </div>
        <SubscriptionSwitch />
      </div>

      <Separator />

      <div className='grid lg:grid-cols-2 gap-5'>
        <div>
          <h6>{t('change_password')}</h6>
          <p className='mt-1 text-sm text-neutral-400'>{t('change_password_desc')}</p>
        </div>
        <ChangePasswordForm />
      </div>

      <Separator />

      <AccountDeletion />
    </div>
  )
}

export default SettingsPage
