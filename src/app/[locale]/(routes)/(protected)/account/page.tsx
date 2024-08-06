import UserInfoForm from '@/components/forms/user-info-form'
import React from 'react'
import Banner from './_components/banner'
import { AppRoutes } from '@/routes'
import { auth } from '@/auth'
import { getTranslations } from 'next-intl/server'

const AccountPage = async () => {
  const t = await getTranslations('profile')
  const session = await auth()

  return (
    <div className='space-y-12'>
      <div className='flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5'>
        <Banner
          title={t('order_tracking_title')}
          desc={t('order_tracking_desc')}
          image='/boxes.jpg'
          link={AppRoutes.ACCOUNT_ORDERS}
        />

        <Banner
          title={t('billing_address_title')}
          desc={t('billing_address_desc')}
          image='/boxes.jpg'
          link={AppRoutes.ACCOUNT_ADDRESSES}
        />
      </div>

      <div>
        <h1 className='h3 mb-4'>
          {t('account_title')} {session?.user.firstName}
        </h1>
        <UserInfoForm />
      </div>
    </div>
  )
}

export default AccountPage
