import React from 'react'
import Logo from '../common/logo'
import SearchBar from './searchbar'
import NavActions from './nav-actions'
import MobileMenu from './mobile-menu'
import Link from 'next/link'
import { cn, filterMenuItemsByUrl, replaceShopifyLink } from '@/lib/utils'
import { MenuItem } from '@/gql/storefront/graphql'

interface INavbar {
  mainMenu: MenuItem[]
  catalogMenu: MenuItem[]
}

const Navbar: React.FC<INavbar> = ({ mainMenu, catalogMenu }) => {
  return (
    <header
      className={cn(
        'w-full bg-primary shadow-md py-4 sticky top-[-1px] z-10 transition-[top] ease duration-300 will-change-transform'
      )}
    >
      <div className='container flex items-center justify-between gap-8'>
        <div className='flex items-center gap-3'>
          <MobileMenu mainMenu={mainMenu} catalogMenu={catalogMenu} />
          <Logo />
        </div>
        <SearchBar catalogMenu={catalogMenu} />
        <NavActions />
      </div>
      <SubMenu mainMenu={mainMenu} />
    </header>
  )
}

const SubMenu: React.FC<{ mainMenu: MenuItem[] }> = ({ mainMenu }) => {
  const leftSideItems = filterMenuItemsByUrl(mainMenu, '#left')
  const rightSideItems = filterMenuItemsByUrl(mainMenu, '#right')

  return (
    <div className='border-t border-white/30 mt-4 hidden lg:block'>
      <nav className='container mt-4 flex justify-between text-primary-foreground font-semibold text-sm'>
        <ul className='flex items-center gap-10'>
          {leftSideItems.map((item) => (
            <li key={item.id}>
              <Link href={replaceShopifyLink(item.url)} className='hover:opacity-90'>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <ul className='flex items-center gap-10'>
          {rightSideItems.map((item) => (
            <li key={item.id}>
              <Link href={replaceShopifyLink(item.url)} className='hover:opacity-90'>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
