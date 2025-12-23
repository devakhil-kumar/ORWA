import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminProfileService, getProfileService } from '../../apis/service';
import { saveProfileData } from '../../units/asyncStorageManager';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfileService();
            saveProfileData(data?.data)
            return data?.data || {};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAdminProfile = createAsyncThunk(
    'profile/fetchAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAdminProfileService();
            console.log(data, 'data+++++++++')
            saveProfileData(data?.data)
            return data?.data || {};
        } catch {
            return rejectWithValue(error.message);
        }
    }
)


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
                console.log(action.payload, 'payload++++=')
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminerror = action.payload;
                console.log(action.payload, 'payload')
            })
    }
});

export const { resetUpdateState } = getprofileSlice.actions;
export default getprofileSlice.reducer;
