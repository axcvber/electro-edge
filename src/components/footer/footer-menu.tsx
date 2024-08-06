'use client'

import React from 'react'
import { MenuItem } from '@/gql/storefront/graphql'
import { useInitialData } from '@/hooks/use-initial-data'
import Payments from './payments'
import { replaceShopifyLink } from '@/lib/utils'
import FooterLink from './footer-link'
import { useTranslations } from 'next-intl'

const FooterMenu: React.FC<{ data: MenuItem[] }> = ({ data }) => {
  const { contacts } = useInitialData()
  const t = useTranslations('headings')

  const socialLinks = contacts?.fields.social_icons

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
      {data.map((item) => (
        <div key={item.id}>
          <FooterHeading heading={item.title} />
          <FooterList>
            {item.items.map((item) => (
              <li key={item.id}>
                <FooterLink href={replaceShopifyLink(item.url)}>{item.title}</FooterLink>
              </li>
            ))}
          </FooterList>
        </div>
      ))}

      <div className='space-y-10'>
        <div>
          <FooterHeading heading={t('payments')} />
          <Payments />
        </div>
        <div>
          <FooterHeading heading={t('follow_us')} />
          <FooterList>
            {socialLinks?.map((item, inx) => (
              <li key={inx}>
                <FooterLink href={item.fields.link} target='_blank' rel='noopener noreferrer'>
                  {item.fields.label}
                </FooterLink>
              </li>
            ))}
          </FooterList>
        </div>
      </div>
    </div>
  )
}

const FooterList: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 2 }) => {
  return <ul className={`space-y-${gap}`}>{children}</ul>
}

const FooterHeading: React.FC<{ heading: string }> = ({ heading }) => {
  return <h3 className='mb-3 h5'>{heading}</h3>
}

export default FooterMenu
