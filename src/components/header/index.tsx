import { getHeaderNavigation } from '@/actions/navigation/get-header-nav'
import SubNavbar from './sub-navbar'
import Navbar from './navbar'

const Header = async () => {
  const { mainMenu, catalogMenu } = await getHeaderNavigation()

  return (
    <>
      <SubNavbar />
      <Navbar mainMenu={mainMenu} catalogMenu={catalogMenu} />
    </>
  )
}

export default Header
