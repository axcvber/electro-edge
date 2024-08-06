import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDown } from 'lucide-react'
import Markdown from '../markdown'

interface AccordionSectionFields {
  heading: string
  accordion_group: NormalizedAccordionItem[]
}

interface NormalizedAccordionItem {
  fields: {
    title: string
    body: string
  }
}

const AccordionSection: React.FC<AccordionSectionFields> = ({ heading, accordion_group }) => {
  return (
    <div className='bg-accent py-[100px]'>
      <div className='container space-y-10'>
        <h3 className='text-center'>{heading}</h3>

        <Accordion type='multiple' className='space-y-4 max-w-3xl mx-auto'>
          {accordion_group.map((item, inx) => (
            <AccordionItem
              key={inx}
              value={inx.toString()}
              className='bg-background px-4 border-none rounded-md shadow-sm'
            >
              <AccordionTrigger showIcon={false} className='font-semibold justify-start items-start text-start gap-6 '>
                <div className='bg-primary rounded-full p-1.5'>
                  <ChevronDown className='h-4 w-4 text-white shrink-0 transition-transform duration-200' />
                </div>

                {item.fields.title}
              </AccordionTrigger>
              <AccordionContent className='pl-[52px] pb-8 text-neutral-500'>
                <Markdown content={item.fields.body} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default AccordionSection
