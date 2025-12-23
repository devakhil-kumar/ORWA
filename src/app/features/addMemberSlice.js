import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiAddmemberService } from '../../apis/service'; 

export const addMember = createAsyncThunk(
  'members/addMember',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiAddmemberService(formData);
      console.log(response.data, 'response__________')
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error|| 'Failed to add member'
      );
    }
  }
);

const initialState = {
  loading: false,
  success: false,    
  error: null,
  memberData: null,   
};

const addmemberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    resetAddMemberState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.memberData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.memberData = action.payload;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetAddMemberState } = addmemberSlice.actions;

export default addmemberSlice.reducer;