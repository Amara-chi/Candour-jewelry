import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI } from '../features/product/productAPI';
import { setFilters } from '../features/product/productSlice';

// SWR fetcher
const fetcher = (url) => productAPI.get(url).then(res => res.data);

export const useProducts = (params = {}) => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.products.filters);
  
  const queryString = new URLSearchParams({
    ...filters,
    ...params,
    page: params.page || 1,
    limit: params.limit || 12
  }).toString();

  const { data, error, mutate, isLoading } = useSWR(
    `/api/products?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      keepPreviousData: true
    }
  );

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    mutate(); // Revalidate with new filters
  };

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
    filters,
    updateFilters
  };
};

export const useProduct = (productId) => {
  const { data, error, mutate, isLoading } = useSWR(
    productId ? `/api/products/${productId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  );

  return {
    product: data?.data,
    loading: isLoading,
    error,
    mutate
  };
};