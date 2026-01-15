import useSWR from 'swr';
import { categoryAPI } from '../features/categories/CategoryAPI';

const fetcher = async () => {
  const response = await categoryAPI.getCategories({ status: 'active' });
  return response.data || [];
};

export const useCategories = () => {
  const { data, error, mutate, isLoading } = useSWR(
    'categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  return {
    categories: data || [],
    loading: isLoading,
    error: error?.message,
    mutate,
  };
};