import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UploadPaymentService, EditPaymentService } from '../../apis/service';

export const uploadPaymentThunk = createAsyncThunk(
    'payment/uploadPayment',
    async ({ userData, isAdmin }, { rejectWithValue }) => {
        try {
            console.log('UserData : ', userData);
            const response = await UploadPaymentService(userData, isAdmin);
            console.log(response.data, 'response===========')
            return response.data;
        } catch (error) {
            console.log("Error : ", error);
            return rejectWithValue(
                {
                    message: error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Failed to upload payment',
                    status: error.response?.status
                }
            );
        }
    }
);
export const editPaymentThunk = createAsyncThunk(
    'payment/editPayment',
    async ({ userData, paymentId }, { rejectWithValue }) => {
        try {
            console.log("Payment ID : ", paymentId);
            const response = await EditPaymentService(userData, paymentId);
            return response.data;
        } catch (error) {
            console.log("Error : ", error, ",Please try again.");
            return rejectWithValue(
                { message: error.message || 'Failed to edit payment'}
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
                state.error = action.payload?.message || 'Something went wrong';
            })
            .addCase(editPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.paymentData = action.payload;
            })
            .addCase(editPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
    },
});

export const { resetPaymentState } = paymentUploadSlice.actions;
export default paymentUploadSlice.reducer;