import NextImage from '@/components/ui/next-image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen w-full'>
      <div className='relative hidden w-1/2 lg:flex'>
        <NextImage priority fill sizes='50vw' quality={100} className='object-cover' src='/auth.jpg' alt='background' />
      </div>
      <div className='container flex items-center justify-center w-full lg:w-1/2 py-12'>{children}</div>
    </div>
  )
}
