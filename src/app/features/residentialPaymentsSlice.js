import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchResidentialPaymentsService,
  fetchResidentialPaymentsFromIdService,
} from '../../apis/service';

export const fetchResidentialPaymentsThunk = createAsyncThunk(
  'residentialPayments/fetch',
  async ({ type = 'all', page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchResidentialPaymentsService(type, page, limit);
      console.log('ALL payments response →', JSON.stringify(response, null, 2));
      return { ...response, page, limit };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load payments');
    }
  }
);

export const fetchResidentialPaymentsFromIdThunk = createAsyncThunk(
  'residentialPaymentsFromId/fetch',
  async ({ id, userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const residentialId = id || userId;
      const response = await fetchResidentialPaymentsFromIdService(
        residentialId,
        page,
        limit
      );
      console.log('FROM-ID payments response →', JSON.stringify(response, null, 2));
      return { ...response, page, limit };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load payments');
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
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
    selectedType: 'all',
  },
  reducers: {
    setPaymentFilter: (state, action) => {
      state.selectedType = action.payload;
    },
    resetPaymentsState: (state) => {
      state.data = [];
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.page = 1;
      state.totalPages = 1;
      state.hasMore = true;
      state.count = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state, action) => {
      const page = action.meta?.arg?.page || 1;
      if (page === 1) {
        state.loading = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.loadingMore = false;

      const newData =
        action.payload?.data ||
        action.payload?.payments ||
        action.payload?.results ||
        (Array.isArray(action.payload) ? action.payload : []) ||
        [];

      const incomingPage = action.payload?.page || action.meta?.arg?.page || 1;
      const limit = action.payload?.limit || action.meta?.arg?.limit || 10;

      let totalPages =
        action.payload?.totalPages ||
        action.payload?.total_pages ||
        action.payload?.pages ||
        null;

      if (!totalPages) {
        if (action.payload?.total && limit) {
          totalPages = Math.ceil(Number(action.payload.total) / limit);
        } else {
          totalPages = newData.length < limit ? incomingPage : incomingPage + 1;
        }
      }

      if (incomingPage === 1) {
        state.data = newData;
      } else {
        const existingIds = new Set(state.data.map((i) => i._id));
        state.data = [
          ...state.data,
          ...newData.filter((i) => !existingIds.has(i._id)),
        ];
      }

      state.count = action.payload?.count ?? state.data.length;
      state.total = action.payload?.total ?? state.data.length;
      state.page = incomingPage;
      state.totalPages = totalPages;
      state.hasMore = incomingPage < totalPages && newData.length >= limit;

      console.log(
        `✅ Page ${incomingPage}/${totalPages} | received ${newData.length} | total in list: ${state.data.length} | hasMore: ${state.hasMore}`
      );
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload || 'Something went wrong';
    };

    builder
      .addCase(fetchResidentialPaymentsThunk.pending, handlePending)
      .addCase(fetchResidentialPaymentsThunk.fulfilled, handleFulfilled)
      .addCase(fetchResidentialPaymentsThunk.rejected, handleRejected)

      .addCase(fetchResidentialPaymentsFromIdThunk.pending, handlePending)
      .addCase(fetchResidentialPaymentsFromIdThunk.fulfilled, handleFulfilled)
      .addCase(fetchResidentialPaymentsFromIdThunk.rejected, handleRejected);
  },
});

export const { setPaymentFilter, resetPaymentsState } =
  residentialPaymentsSlice.actions;
export default residentialPaymentsSlice.reducer;