// app/features/paymentVerifySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyPaymentService } from '../../apis/service';

export const verifyPaymentThunk = createAsyncThunk(
  'payment/verify',
  async ({ paymentId, status }, { rejectWithValue }) => {
    try {
      const response = await verifyPaymentService(paymentId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to verify payment');
    }
  }
);

const paymentVerifySlice = createSlice({
  name: 'paymentVerify',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetVerifyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerifyState } = paymentVerifySlice.actions;
export default paymentVerifySlice.reducer;