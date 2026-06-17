import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentHistoryService } from '../../apis/service';

// Async Thunk to fetch payment history
export const fetchPaymentHistory = createAsyncThunk(
  'paymentHistory/fetchPaymentHistory',
  async ({ year, page = 1, limit = 30 }, { rejectWithValue }) => {
    try {
      const response = await PaymentHistoryService(year, page, limit);
      return response.data; // { success, count, total, page, totalPages, data }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to fetch payment history',
        status: error.response?.status,  
      });
    }
  }
);

const paymentHistorySlice = createSlice({
  name: 'paymentHistory',
  initialState: {
    data: [],               // Array of payment records
    count: 0,               // Current page count
    total: 0,               // Total records
    page: 1,                // Current page
    totalPages: 1,          // Total pages
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPaymentHistoryState: (state) => {
      state.data = [];
      state.count = 0;
      state.total = 0;
      state.page = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.data || [];
        state.count = action.payload.count || 0;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      // Rejected
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetPaymentHistoryState } = paymentHistorySlice.actions;
export default paymentHistorySlice.reducer;