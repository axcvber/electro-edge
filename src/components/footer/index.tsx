import React from 'react'
import Logo from '../common/logo'
import Contacts from '../contacts/contacts'
import { getFooterNavigation } from '@/actions/navigation/get-footer-nav'
import FooterMenu from './footer-menu'
import SubFooter from './sub-footer'

const Footer = async () => {
  const footerMenu = await getFooterNavigation()

  return (
    <footer className='bg-secondary text-secondary-foreground pt-12'>
      <nav className='container flex justify-between flex-wrap flex-col lg:flex-row gap-12'>
        <div className='flex flex-col gap-8'>
          <Logo />
          <Contacts />
        </div>

        <FooterMenu data={footerMenu} />
      </nav>

      <SubFooter />
    </footer>
  )
}

export default Footer
