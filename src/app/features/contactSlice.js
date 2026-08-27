import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContactusService } from '../../apis/service';

// Async Thunk for Contact Us (admin help desk submission)
export const submitContactUs = createAsyncThunk(
  'contact/submitContactUs',
  async (message, { rejectWithValue }) => {
    try {
      const response = await ContactusService(message);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to send message. Please try again.'
      );
    }
  }
);

// Initial State
const initialState = {
  loading: false,
  success: false,
  error: null,
  responseMessage: null,
};

// Slice
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.responseMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactUs.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.responseMessage = null;
      })
      .addCase(submitContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.responseMessage =
          action.payload.message || 'Message sent successfully!';
      })
      .addCase(submitContactUs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error.message || 'Something went wrong';
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;