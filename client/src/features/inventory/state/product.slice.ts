import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@snitch/types';

export interface ProductState {
  items: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  message: string;
}

const initialState: ProductState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 20,
  hasNextPage: false,
  hasPreviousPage: false,

  currentProduct: null,
  loading: false,
  error: null,
  message: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{
        items: Product[];
        pagination?: {
          currentPage: number;
          itemsPerPage: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>,
    ) => {
      state.items = action.payload.items as Product[];
      if (action.payload.pagination) {
        state.totalItems = action.payload.pagination.totalItems;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.currentPage;
        state.pageSize = action.payload.pagination.itemsPerPage;
        state.hasNextPage = action.payload.pagination.hasNextPage;
        state.hasPreviousPage = action.payload.pagination.hasPreviousPage;
      }
    },

    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = '';
    },

    resetProductState: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
      state.pageSize = 20;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
      state.message = '';
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;
