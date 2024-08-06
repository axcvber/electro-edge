import { getPage } from '@/actions/pages/get-page'
import BlockManager from '@/components/blocks'

const Page = async ({ params }: { params: { slug: string } }) => {
  const { blocks } = await getPage(params.slug)
  return <BlockManager blocks={blocks} />
}

export default Page
