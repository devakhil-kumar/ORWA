// app/features/residentialPaymentsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchResidentialPaymentsService } from '../../apis/service';

export const fetchResidentialPaymentsThunk = createAsyncThunk(
  'residentialPayments/fetch',
  async (type = 'all', { rejectWithValue }) => {
    try {
      const response = await fetchResidentialPaymentsService(type);
      console.log(response, 'response+++++++++++')
      return response; // assuming response has { success, data, count, total, page, totalPages }
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to load payments'
      );
    }
  }
);

const residentialPaymentsSlice = createSlice({
  name: 'residentialPayments',
  initialState: {
    data: [],
    count: 0,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    selectedType: 'all', // all, pending, verified, rejected
  },
  reducers: {
    setPaymentFilter: (state, action) => {
      state.selectedType = action.payload;
    },
    resetPaymentsState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResidentialPaymentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentialPaymentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
        state.count = action.payload.count || 0;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchResidentialPaymentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { setPaymentFilter, resetPaymentsState } = residentialPaymentsSlice.actions;
export default residentialPaymentsSlice.reducer;