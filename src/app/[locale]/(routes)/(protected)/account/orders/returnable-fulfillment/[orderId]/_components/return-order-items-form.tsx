'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import NextImage from '@/components/ui/next-image'
import { ReturnReason } from '@/gql/admin/graphql'
import { ReturnOrderFormSchemaType, returnOrderFormSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ReshapedReturnableFulfillment } from '@/lib/normalize'
import FormInput from '@/components/forms/elements/form-input'
import { formatPrice, getReturnReasonMessage, setFormErrors } from '@/lib/utils'
import { Send } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import ReturnItemQuantityCounter from './return-item-counter'
import Link from 'next/link'
import { AppRoutes } from '@/routes'
import { createReturnRequest } from '@/actions/order/create-return-request'
import { useToast } from '@/hooks/use-toast'
import FormSelect from '@/components/forms/elements/form-select'

interface IReturnOrderItemsForm {
  data: ReshapedReturnableFulfillment[]
  orderId: string
}

const initializeLineItems = (data: ReshapedReturnableFulfillment[]) => {
  return data.map((item) => ({
    ...item,
    quantity: item.initialQuantity,
    customerNote: '',
    selected: false,
  }))
}

const ReturnOrderItemsForm: React.FC<IReturnOrderItemsForm> = ({ orderId, data }) => {
  const form = useForm<ReturnOrderFormSchemaType>({
    resolver: zodResolver(returnOrderFormSchema),
    mode: 'onChange',
    defaultValues: {
      lineItems: initializeLineItems(data),
    },
  })

  const { control, formState, clearErrors, reset } = form
  const { fields, update } = useFieldArray({
    control,
    name: 'lineItems',
  })
  const { toast } = useToast()

  const selectAllTitle = fields.every((item) => item.selected) ? 'Deselect All' : 'Select All'
  const selectedItemsCount = fields.filter((item) => item.selected).reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    reset({
      lineItems: initializeLineItems(data),
    })
  }, [data, reset])

  const handleToggleSelectAll = () => {
    const allSelected = fields.every((item) => item.selected)
    fields.forEach((item, index) => {
      update(index, { ...item, selected: !allSelected as any })
    })
  }

  const handleQuantityIncrement = (index: number) => {
    if (fields[index].quantity < fields[index].initialQuantity) {
      fields[index].quantity += 1
      form.setValue(`lineItems.${index}.quantity`, fields[index].quantity, { shouldValidate: true })
    }
  }

  const handleQuantityDecrement = (index: number) => {
    if (fields[index].quantity > 1) {
      fields[index].quantity -= 1
      form.setValue(`lineItems.${index}.quantity`, fields[index].quantity, { shouldValidate: true })
    }
  }

  const onSubmit = async (forData: ReturnOrderFormSchemaType) => {
    const result = await createReturnRequest(orderId, forData)
    if (result?.error) {
      if (Array.isArray(result.error)) {
        setFormErrors(result.error, form.setError)
        return false
      }

      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      form.reset()
      toast({
        title: `Your return request was sent and is being reviewed. We'll email you once it's been completed.`,
        variant: 'success',
        duration: Infinity,
      })
    }
  }

  const returnReasonValues = Object.values(ReturnReason).filter((reason) => reason !== ReturnReason.Unknown)
  const returnOptions = returnReasonValues.map((item) => ({
    value: item,
    label: getReturnReasonMessage(item) ?? '',
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex items-center justify-between '>
          <p className='text-sm'>{`${selectedItemsCount} items selected`}</p>
          <Button variant={'link'} onClick={handleToggleSelectAll}>
            {selectAllTitle}
          </Button>
        </div>
        <p className='text-destructive font-medium text-sm'>
          {formState.errors.lineItems?.message || formState.errors.lineItems?.root?.message}
        </p>

        {fields.map((item, inx) => (
          <div
            key={item.fulfillmentLineItemId}
            className='border p-4 rounded-md grid grid-cols-[minmax(auto,_max-content)_minmax(auto,_auto)] lg:grid-cols-[minmax(auto,_max-content)_minmax(auto,_max-content)_minmax(0,_1fr)_minmax(auto,_1fr)] items-center gap-4'
          >
            <Checkbox
              checked={item.selected}
              onCheckedChange={(checked) => update(inx, { ...item, selected: Boolean(checked) })}
            />
            <div className='w-fit relative'>
              <NextImage width={64} height={64} src={item.image?.url} alt={item.image?.altText} />
              <div className='absolute w-6 h-6 flex items-center justify-center text-xs -top-2 -right-2 bg-secondary rounded-full text-secondary-foreground'>
                {item.initialQuantity}
              </div>
            </div>

            <div className='col-start-2 lg:col-start-auto'>
              <h6 className='text-base'>{item.title}</h6>
              <p className='text-sm text-neutral-400'>{item.variantTitle}</p>
            </div>
            <p className='text-sm font-medium col-start-2 lg:col-start-auto lg:text-end'>
              {formatPrice(item.price.amount, item.price?.currencyCode)}
            </p>

            {item.selected && (
              <div className='mt-2 space-y-3 col-start-2 col-end-3 lg:col-end-4'>
                <ReturnItemQuantityCounter
                  control={form.control}
                  name={`lineItems.${inx}.quantity`}
                  initialQuantity={item.initialQuantity}
                  onIncrement={() => handleQuantityIncrement(inx)}
                  onDecrement={() => handleQuantityDecrement(inx)}
                />

                <FormSelect
                  control={form.control}
                  name={`lineItems.${inx}.returnReason`}
                  options={returnOptions}
                  placeholder='Select a reason'
                  label='Reason'
                  required
                />
                <FormInput
                  control={form.control}
                  name={`lineItems.${inx}.customerNote`}
                  label='Note (optional)'
                  placeholder='Enter a note'
                />
              </div>
            )}
          </div>
        ))}

        <div className='flex gap-4 items-center justify-between flex-wrap'>
          <p className='text-sm text-neutral-500'>
            Learn about our{' '}
            <Button asChild variant='link'>
              <Link href={AppRoutes.REFUND_POLICY}>Refund policy.</Link>
            </Button>{' '}
            If you have any questions,{' '}
            <Button asChild variant='link'>
              <Link href={AppRoutes.CONTACT}>Contact Us.</Link>
            </Button>
          </p>
          <div className='flex gap-3'>
            <Button asChild variant={'outline'}>
              <Link href={AppRoutes.ACCOUNT_ORDERS}>Cancel</Link>
            </Button>
            <Button
              type='submit'
              variant={'secondary'}
              isLoading={formState.isSubmitting}
              onClick={() => clearErrors('lineItems')}
              disabled={!formState.isValid || formState.isSubmitting}
            >
              <Send />
              Request return
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ReturnOrderItemsForm
