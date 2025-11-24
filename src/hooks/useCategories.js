import useSWR from 'swr';
import { categoryAPI } from '../features/categories/CategoryAPI';

const fetcher = (url) => categoryAPI.get(url).then(res => res.data);

export const useCategories = () => {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute cache
    }
  );

  return {
    categories: data?.data || [],
    loading: isLoading,
    error,
    mutate,
  };
};