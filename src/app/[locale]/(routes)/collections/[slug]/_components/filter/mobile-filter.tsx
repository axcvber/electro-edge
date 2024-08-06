import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ListFilter } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import FilterList from './filter-list'
import useQueryParams from '@/hooks/use-query-params'

const MobileFilter = () => {
  const { clearAllParams } = useQueryParams()

  return (
    <Drawer>
      <DrawerTrigger asChild className='lg:hidden'>
        <Button size={'sm'} variant={'outline-primary'}>
          <ListFilter />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className='px-4 max-h-[60vh] overflow-y-auto'>
          <FilterList />
        </ScrollArea>
        <DrawerFooter className='flex-row gap-3'>
          <DrawerClose asChild>
            <Button className='flex-1' variant='outline' onClick={clearAllParams}>
              Clear All
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className='flex-1'>Apply</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileFilter
