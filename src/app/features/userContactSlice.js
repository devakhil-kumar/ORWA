import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserContactUsSerivce, usersContactUsListSerivce } from '../../apis/service';

// Submit a new complaint (user -> admin)
export const submitUserContactUs = createAsyncThunk(
  'contactUser/submitContactUs',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await UserContactUsSerivce(formData);
      return response;
    } catch (error) {
      console.log('error from help desk : ', error);
      return rejectWithValue({
        message:
          error?.status === 401
            ? 'You have been LoggedOut, Please login again.'
            : error?.message,
        status: error?.status,
      });
    }
  }
);

// Get list of the logged-in user's submitted complaints
export const usersContactUsList = createAsyncThunk(
  'contactUser/usersContactUsList',
  async ({ status = '', page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await usersContactUsListSerivce(status, page, limit);

      console.log(
        'Complaints API Response =>',
        JSON.stringify(response, null, 2)
      );

      // usersContactUsListSerivce already returns response.data,
      // whose shape is: { success, data: [...], page, total, totalPages, statusCounts }
      return response;
    } catch (error) {
      console.log('Complaints API Error =>', error);

      return rejectWithValue({
        message:
          error?.status === 401
            ? 'You have been LoggedOut, Please login again.'
            : error?.message || 'Something went wrong',
        status: error?.status,
      });
    }
  }
);

// Initial State
const initialState = {
  loading: false,
  success: false,
  usersComplaints: [],
  page: 1,
  total: 0,
  totalPages: 1,
  error: null,
  responseMessage: null,
};

// Slice
const userContactSerivce = createSlice({
  name: 'contactUser',
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
      // Submit complaint
      .addCase(submitUserContactUs.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.responseMessage = null;
      })
      .addCase(submitUserContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.responseMessage =
          action.payload.message || 'Message sent successfully!';
      })
      .addCase(submitUserContactUs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error.message || 'Something went wrong';
      })

      // List complaints
      .addCase(usersContactUsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usersContactUsList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.usersComplaints = action.payload?.data || [];
        state.page = action.payload?.page || 1;
        state.total = action.payload?.total || 0;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(usersContactUsList.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || 'Something went wrong';
        state.usersComplaints = [];
      });
  },
});

export const { resetContactState } = userContactSerivce.actions;
export default userContactSerivce.reducer;