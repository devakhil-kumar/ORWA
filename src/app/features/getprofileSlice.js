import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminProfileService, getProfileService, TerminationRequestService, updateUserProfileService } from '../../apis/service';
import { saveProfileData } from '../../units/asyncStorageManager';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfileService();
            saveProfileData(data?.data)
            return data?.data || {};
        } catch (error) {
            return rejectWithValue({ message: error.message, status: error.response?.status, });
        }
    }
);

export const fetchAdminProfile = createAsyncThunk(
    'profile/fetchAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAdminProfileService();
            saveProfileData(data?.data)
            return data?.data || {};
        } catch {
            return rejectWithValue(error.message);
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (updatedData, { rejectWithValue }) => {
        try {
            console.log('Updated profile data from slice :', updatedData);
            const data = await updateUserProfileService(updatedData);
            console.log('Updated profile data from slice:', data);
            saveProfileData(data?.data)
            return data?.data || {};
        } catch (error) {
            console.log("Error :",error);
            return rejectWithValue(error.message);
        }
    }
);

export const terminationRequest = createAsyncThunk(
    'profile/terminationRequest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await TerminationRequestService(id);
            return response;
        } catch (err) {
            return rejectWithValue(err || { message: 'Failed to send termination request' });
        }
    }
);



const getprofileSlice = createSlice({
    name: 'profile',
    initialState: {
        user: null,
        loading: false,
        error: null,
        admin: null,
        adminLoading: null,
        adminerror: null
    },
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(fetchProfile.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAdminProfile.pending, state => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminProfile.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.admin = action.payload;
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminerror = action.payload;
            })
            .addCase(updateUserProfile.pending, state => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.admin = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminerror = action.payload;
            })
            .addCase(terminationRequest.fulfilled, (state, action) => {
                state.loading = false;

                if (state.admin) {
                    state.admin.terminationRequested = true;
                    state.admin.terminationRequestedAt = new Date().toISOString();
                }
            })
            .addCase(terminationRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(terminationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetUpdateState } = getprofileSlice.actions;
export default getprofileSlice.reducer;
