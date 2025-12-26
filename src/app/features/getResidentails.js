import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAdminResdidentailsService } from '../../apis/service';

export const fetchAdminResidentials = createAsyncThunk(
    'adminResidentials/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAdminResdidentailsService();
            console.log(response, 'response++++++')
            return response.data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const adminResidentialSlice = createSlice({
    name: 'adminResidentials',
    initialState: {
        residentials: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminResidentials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminResidentials.fulfilled, (state, action) => {
                state.loading = false;
                state.residentials = action.payload;
            })
            .addCase(fetchAdminResidentials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminResidentialSlice.reducer;
