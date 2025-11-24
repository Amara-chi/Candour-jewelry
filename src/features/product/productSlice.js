import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from './productAPI';

// Async thunks with optimistic updates
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProduct(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const response = await productAPI.createProduct(productData);
      
      // Optimistically update the list
      dispatch(addProductOptimistically(response.data));
      
      return response.data;
    } catch (error) {
      // Rollback on error
      dispatch(removeOptimisticProduct(productData._tempId));
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue, dispatch }) => {
    try {
      // Optimistic update
      dispatch(updateProductOptimistically({ id, changes: productData }));
      
      const response = await productAPI.updateProduct(id, productData);
      return response.data;
    } catch (error) {
      // Rollback on error - you might want to implement proper rollback
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      // Optimistic removal
      dispatch(removeProductOptimistically(productId));
      
      await productAPI.deleteProduct(productId);
      return productId;
    } catch (error) {
      // Rollback on error
      dispatch(undoRemoveProduct(productId));
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      priceRange: [0, 1000],
      inStock: false,
      featured: false
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0
    },
    optimisticUpdates: [] // Track optimistic updates for rollback
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page on filter change
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        priceRange: [0, 1000],
        inStock: false,
        featured: false
      };
    },
    // Optimistic update reducers
    addProductOptimistically: (state, action) => {
      const product = {
        ...action.payload,
        _optimistic: true,
        _tempId: action.payload._tempId || Date.now().toString()
      };
      state.items.unshift(product);
    },
    removeOptimisticProduct: (state, action) => {
      state.items = state.items.filter(item => item._tempId !== action.payload);
    },
    updateProductOptimistically: (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.changes,
          _optimistic: true
        };
      }
    },
    removeProductOptimistically: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    undoRemoveProduct: (state, action) => {
      // This would require storing the removed item for proper rollback
      // Implement based on your needs
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Product
      .addCase(getProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      // Create Product (optimistic update confirmed)
      .addCase(createProduct.fulfilled, (state, action) => {
        // Replace optimistic product with real one
        const index = state.items.findIndex(item => item._tempId === action.payload._tempId);
        if (index !== -1) {
          state.items[index] = { ...action.payload, _optimistic: false };
        }
      })
      // Update Product (optimistic update confirmed)
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = { ...action.payload, _optimistic: false };
        }
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete Product (optimistic removal confirmed)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Removal already done
      });
  }
});

export const {
  clearError,
  setFilters,
  clearFilters,
  addProductOptimistically,
  removeOptimisticProduct,
  updateProductOptimistically,
  removeProductOptimistically,
  undoRemoveProduct
} = productSlice.actions;

export default productSlice.reducer;