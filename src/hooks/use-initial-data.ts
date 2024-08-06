import { getInitialData } from '@/actions/app/get-initial-data'
import { useQuery } from '@tanstack/react-query'

export const useInitialData = () => {
  const { data } = useQuery({
    queryKey: ['initial-data'],
    queryFn: async () => await getInitialData(),
    staleTime: 60000,
  })

  return { globalData: data?.globalData, contacts: data?.contacts }
}
