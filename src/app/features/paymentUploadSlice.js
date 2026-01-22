import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UploadPaymentService } from '../../apis/service';

export const uploadPaymentThunk = createAsyncThunk(
    'payment/uploadPayment',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('UserData : ', userData);
            const response = await UploadPaymentService(userData);
            console.log(response.data, 'response===========')
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to upload payment'
            );
        }
    }
);

const paymentUploadSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        success: false,
        error: null,
        paymentData: null,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.paymentData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadPaymentThunk.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.paymentData = action.payload;
            })
            .addCase(uploadPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetPaymentState } = paymentUploadSlice.actions;
export default paymentUploadSlice.reducer;