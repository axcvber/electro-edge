import { getPage } from '@/actions/pages/get-page'
import BlockManager from '@/components/blocks'

const Home = async () => {
  const { blocks } = await getPage('home')

  return <BlockManager blocks={blocks} />
}

export default Home
