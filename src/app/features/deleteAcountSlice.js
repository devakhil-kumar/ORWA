import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteResidential } from '../../apis/api'; 

// Initial State
const initialState = {
  isLoading: false,
  error: null,
  deleteStatus: 'idle', 
  deleteMessage: null,
};

// Thunk for deleting residential
export const deleteResidentialThunk = createAsyncThunk(
  'residential/delete',
  async (userId, { rejectWithValue }) => {
    try {
        console.log(userId, 'userIDfromthunk')
      const response = await deleteResidential(userId);
      console.log(response,'res')
      return response.data;
      
    } catch (error) {
        console.log(error,'res')

      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete residential'
      );
    }
  }
);

// Residential Delete Slice
const deleteResidentialSlice = createSlice({
  name: 'deleteResidential',
  initialState,
  reducers: {
    // Reset delete status
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
      state.deleteMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete Residential Cases
      .addCase(deleteResidentialThunk.pending, (state) => {
        state.isLoading = true;
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteResidentialThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteStatus = 'succeeded';
        state.deleteMessage = action.payload.message || 'Residential deleted successfully';
      })
      .addCase(deleteResidentialThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetDeleteStatus } = deleteResidentialSlice.actions;

// Export reducer
export default deleteResidentialSlice.reducer;