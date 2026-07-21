import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ProductState {
  products: Record<string, string>[]; // TODO: Replace with actual Product type
  currentProduct: Record<string, string> | null;
  loading: boolean;
  error: string | null;
  message: string;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  message: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Record<string, string>[]>) => {
      state.products = action.payload;
    },

    setCurrentProduct: (state, action: PayloadAction<Record<string, string> | null>) => {
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
      state.products = [];
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
