import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
//@ts-ignore
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

interface IMarkdown {
  content?: string
  spacing?: number
  parseRichText?: boolean
}

const Markdown: React.FC<IMarkdown> = ({ content, spacing = 3, parseRichText = true }) => {
  if (!content) return null

  const markdown = parseRichText ? convertSchemaToHtml(content) : content

  return (
    <div className='space-y-2'>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          li: ({ children }) => <li className='leading-normal my-2'>{children}</li>,
          p: ({ children }) => <p className='leading-normal'>{children}</p>,
          h1: ({ children }) => <h1 className='h3'>{children}</h1>,
          h2: ({ children }) => <h2 className='h4'>{children}</h2>,
          h3: ({ children }) => <h3 className='h5'>{children}</h3>,
          h4: ({ children }) => <h4 className='h6'>{children}</h4>,
          h5: ({ children }) => <h5 className='h6'>{children}</h5>,
          h6: ({ children }) => <h6 className='h6'>{children}</h6>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
