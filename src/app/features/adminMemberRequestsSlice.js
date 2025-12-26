import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {verifyMemberService,AdminMemeberRequestsService } from '../../apis/service';


export const fetchMemberRequests = createAsyncThunk(
    'adminMemberRequests/fetchMemberRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminMemeberRequestsService();
            console.log(response, 'hcvbsldfhjfbsvfdv')
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue({ message: 'Failed to fetch profile.' });
        }
    }
);

// Thunk to verify member payment
export const verifyMemberPayment = createAsyncThunk(
    'adminMemberRequests/verifyMemberPayment',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await verifyMemberService(id, status);
            console.log(response, 'response++++++++++++++=');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to update payment status' }
            );
        }
    }
);

const initialState = {
    memberRequests: [],
    loading: false,
    error: null,
    verifyLoading: false,
    verifyError: null,
    verifySuccess: false, // optional: to track successful verification
};

const adminMemberRequestsSlice = createSlice({
    name: 'adminMemberRequests',
    initialState,
    reducers: {
        clearVerifyStatus(state) {
            state.verifyLoading = false;
            state.verifyError = null;
            state.verifySuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch member requests
            .addCase(fetchMemberRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.memberRequests = action.payload;
            })
            .addCase(fetchMemberRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch member requests';
            })

            // Verify member payment
            .addCase(verifyMemberPayment.pending, (state) => {
                state.verifyLoading = true;
                state.verifyError = null;
                state.verifySuccess = false;
            })
            .addCase(verifyMemberPayment.fulfilled, (state, action) => {
                state.verifyLoading = false;
                state.verifySuccess = true;
                const updatedMember = action.payload;
                const index = state.memberRequests.findIndex((m) => m.id === updatedMember.id);
                if (index !== -1) {
                    state.memberRequests[index] = updatedMember;
                }
            })
            .addCase(verifyMemberPayment.rejected, (state, action) => {
                state.verifyLoading = false;
                state.verifyError = action.payload?.message || 'Failed to update payment status';
            });
    },
});

export const { clearVerifyStatus } = adminMemberRequestsSlice.actions;

export default adminMemberRequestsSlice.reducer;