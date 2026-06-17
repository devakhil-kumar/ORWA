import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTerminationRequestService, getAdminResdidentailsService, apiTerminateMemberService, apiReActivateMemberService } from '../../apis/service';

export const fetchAdminResidentials = createAsyncThunk(
    'adminResidentials/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAdminResdidentailsService();
            console.log(response, 'response++++++')
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTerminationRequests = createAsyncThunk(
    'adminResidentials/fetchTerminationRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getTerminationRequestService();
            console.log(response, 'response++++++')
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const terminateMember = createAsyncThunk(
    'adminResidentials/terminateMember',
    async (id, { rejectWithValue }) => {
        try {
            console.log('id in thunk:', id);
            const response = await apiTerminateMemberService(id);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'Failed to delete member',
                status: error?.status || 500,
            });
        }
    }
);

export const reActivateMember = createAsyncThunk(
    'adminResidentials/reActivateMember',
    async (id, { rejectWithValue }) => {
        try {
            console.log('id in thunk:', id);
            const response = await apiReActivateMemberService(id);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'Failed to Re-Activate member',
                status: error?.status || 500,
            });
        }
    }
);



const adminResidentialSlice = createSlice({
    name: 'adminResidentials',
    initialState: {
        residentials: [],
        residentialsReqTermination: [],
        deleteLoading: false,
        reqTerminationLoading: false,
        loading: false,
        error: null,
        deleteLoading: false,
        success: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
        },
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
            })
            .addCase(terminateMember.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(terminateMember.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;
                // state.residentials = state.residentials.filter(
                //     (residentials) => event._id !== action.payload.id && event.id !== action.payload.id
                // );
                // if (state.currentresidentials?._id === action.payload.id || state.currentresidentials?.id === action.payload.id) {
                //     state.currentresidentials = null;
                // }
                // if (state.pagination.total > 0) {
                //     state.pagination.total -= 1;
                // }
            })
            .addCase(terminateMember.rejected, (state, action) => {
                state.deleteLoading = false;
                state.success = false;
                state.error = action.payload?.message || 'Failed to delete member';
            })
            .addCase(reActivateMember.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(reActivateMember.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;
                // state.residentials = state.residentials.filter(
                //     (residentials) => event._id !== action.payload.id && event.id !== action.payload.id
                // );
                // if (state.currentresidentials?._id === action.payload.id || state.currentresidentials?.id === action.payload.id) {
                //     state.currentresidentials = null;
                // }
                // if (state.pagination.total > 0) {
                //     state.pagination.total -= 1;
                // }
            })
            .addCase(reActivateMember.rejected, (state, action) => {
                state.deleteLoading = false;
                state.success = false;
                state.error = action.payload?.message || 'Failed to Re-Activate member';
            })
            .addCase(fetchTerminationRequests.pending, (state) => {
                state.reqTerminationLoading = true;
                state.error = null;
            })
            .addCase(fetchTerminationRequests.fulfilled, (state, action) => {
                state.reqTerminationLoading = false;
                state.residentialsReqTermination = action.payload;
            })
            .addCase(fetchTerminationRequests.rejected, (state, action) => {
                state.reqTerminationLoading = false;
                state.error = action.payload;
            });
    },
});

export default adminResidentialSlice.reducer;
