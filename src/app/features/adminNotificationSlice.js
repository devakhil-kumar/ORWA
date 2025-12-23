import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAdminService } from '../../apis/service';
import { createSlice } from '@reduxjs/toolkit';

// Thunk for fetching admin notifications
export const fetchAdminNotifications = createAsyncThunk(
    'notifications/fetchAdmin',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await notificationAdminService( page, limit ) || {};
            console.log(response.data, 'response++++++=')
            return response.data; 
        } catch (error) {
            console.log(error.response?.data ,'errorr')
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch notifications'
            );
        }
    }
);



const initialState = {
    notifications: [],
    loading: false,
    error: null,
    success: false,
    count: 0,
    total: 0,
    unreadCount: 0,
    page: 1,
    totalPages: 1
};

const adminNotificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
        resetNotifications: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Admin Notifications
            .addCase(fetchAdminNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.notifications = action.payload.data;
                state.count = action.payload.count;
                state.total = action.payload.total;
                state.unreadCount = action.payload.unreadCount;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                console.log(action.payload.data, 'csubdcdfbcdfhvdfvdf')
            })
            .addCase(fetchAdminNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                console.log(action.payload, 'payload+++++')
            });
    }
});

export const { clearNotificationError, resetNotifications } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;