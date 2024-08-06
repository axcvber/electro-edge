'use client'

import React from 'react'
import FooterLink from './footer-link'
import { Separator } from '../ui/separator'
import { useTranslations } from 'next-intl'

const SubFooter = () => {
  const t = useTranslations('links')

  return (
    <div className='container mt-12'>
      <div className='flex justify-between border-t border-border/10 flex-col-reverse flex-wrap-reverse gap-4 py-4 sm:flex-row'>
        <span className='text-xs text-white/50'>
          Copyright &copy;{new Date().getFullYear()} Tech Bud. All Rights Reserved.
        </span>
        <div className='flex items-center gap-3'>
          <FooterLink className='text-xs' href={'/policies/privacy-policy'}>
            {t('privacy_policy')}
          </FooterLink>
          <Separator orientation='vertical' className='bg-white/10 h-4' />
          <FooterLink className='text-xs' href={'/policies/terms-of-service'}>
            {t('terms')}
          </FooterLink>
          <Separator orientation='vertical' className='bg-white/10 h-4' />
          <FooterLink className='text-xs' href={'/sitemap'}>
            {t('sitemap')}
          </FooterLink>
        </div>
      </div>
    </div>
  )
}

export default SubFooter
