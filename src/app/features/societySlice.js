import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { societyAdminService, societyUpdateService } from '../../apis/service';

export const fetchSocietyAdmin = createAsyncThunk(
    'society/fetchSocietyAdmin',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await societyAdminService(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to fetch society details');
        }
    }
);

export const updateSocietyAdmin = createAsyncThunk(
    'society/updateSocietyAdmin',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const response = await societyUpdateService(id, payload);
            console.log(response)
            return response;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error?.message || 'Failed to update society details');
        }
    }
);

const societySlice = createSlice({
    name: 'society',
    initialState: {
        societyData: null,
        loading: false,
        updateLoading: false,
        error: null,
        updateError: null,
        updateSuccess: false,
    },
    reducers: {
        clearUpdateStatus: (state) => {
            state.updateSuccess = false;
            state.updateError = null;
        },
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Society Admin
            .addCase(fetchSocietyAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSocietyAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.societyData = action.payload.data;
            })
            .addCase(fetchSocietyAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update Society Admin
            .addCase(updateSocietyAdmin.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateSocietyAdmin.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;
                // Update the society data with new values
                if (state.societyData) {
                    state.societyData = { ...state.societyData, ...action.payload };
                }
            })
            .addCase(updateSocietyAdmin.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
                state.updateSuccess = false;
            });
    },
});

export const { clearUpdateStatus, clearError } = societySlice.actions;
export default societySlice.reducer;