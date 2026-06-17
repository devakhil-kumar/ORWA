import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserContactUsSerivce } from '../../apis/service';

export const submitUserContactUs = createAsyncThunk(
  'contact/submitContactUs',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await UserContactUsSerivce(formData);
      console.log('cvdgsvbncd m');
      return response;
    } catch (error) {
      console.log("error from help desk : ", error);
      return rejectWithValue({
        message: error?.status === 401 ? 'You have been LoggedOut, Please login again.' : error?.message,
        status: error?.status,
      });
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
const userContactSerivce = createSlice({
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
      .addCase(submitUserContactUs.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.responseMessage = null;
      })
      .addCase(submitUserContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.responseMessage = action.payload.message || 'Message sent successfully!';
      })
      .addCase(submitUserContactUs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message || 'Something went wrong';
      });
  },
});
export const { resetContactState } = userContactSerivce.actions;
export default userContactSerivce.reducer;