import Sidebar from './_components/sidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-col md:flex-row items-start container my-12 gap-8'>
      <Sidebar />
      <div className='w-full'>{children}</div>
    </section>
  )
}
