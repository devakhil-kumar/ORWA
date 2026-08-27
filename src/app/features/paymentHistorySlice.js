import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentHistoryService } from '../../apis/service';

export const fetchPaymentHistory = createAsyncThunk(
  'paymentHistory/fetchPaymentHistory',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await PaymentHistoryService(page, limit);
      return { ...response.data, page };
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
    data: [],
    count: 0,
    total: 0,
    page: 1,
    totalPages: 1,
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
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const data = payload.data || payload.payments || [];
        const page = payload.page || 1;
        const totalPages =
          payload.totalPages ||
          payload.total_pages ||
          payload.pages ||
          1;
        const count = payload.count || 0;
        const total = payload.total || 0;

        state.loading = false;
        state.success = true;
        state.count = count;
        state.total = total;
        state.page = page;
        state.totalPages = totalPages;

        if (page === 1) {
          state.data = data;
        } else {
          const existingIds = new Set(state.data.map((i) => i._id));
          state.data = [
            ...state.data,
            ...data.filter((i) => !existingIds.has(i._id)),
          ];
        }
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetPaymentHistoryState } = paymentHistorySlice.actions;
export default paymentHistorySlice.reducer;