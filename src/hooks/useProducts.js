import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI } from '../features/product/productAPI';
import { setFilters } from '../features/product/productSlice';

const fetcher = async (url) => {
  try {
    const searchParams = new URL(url, window.location.origin).searchParams;
    const params = Object.fromEntries(searchParams.entries());
    const response = await productAPI.getProducts(params);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const useProducts = (params = {}) => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.products?.filters || {});
  
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
      dedupingInterval: 60000,
      keepPreviousData: true,
      onError: (err) => {
        console.error('Products fetch error:', err);
      }
    }
  );

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    mutate();
  };

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error?.message || error?.response?.data?.message || null,
    mutate,
    filters,
    updateFilters
  };
};

export const useProduct = (productId) => {
  const { data, error, mutate, isLoading } = useSWR(
    productId ? `/api/products/${productId}` : null,
    async () => {
      try {
        const response = await productAPI.getProduct(productId);
        return response;
      } catch (error) {
        console.error('Product fetch error:', error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  );

  return {
    product: data,
    loading: isLoading,
    error: error?.message || error?.response?.data?.message || null,
    mutate
  };
};
