import { createAsyncThunk, isAsyncThunkAction } from '@reduxjs/toolkit';
import { AnnouncementsUserService } from '../../apis/service';
import { createSlice } from '@reduxjs/toolkit';

export const fetchAnnouncements = createAsyncThunk(
    'announcements/fetchAnnouncements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AnnouncementsUserService();
            console.log(response, 'response++++++++++++++')
            return response;
        } catch (error) {
            console.log('THUNK ERROR:', error?.response?.data);
            console.log('THUNK ERROR:________', error);
            return rejectWithValue(
                error.message
            );
        }
    }
);


const initialState = {
    list: [],
    unreadCount: 0,
    page: 1,
    totalPages: 0,
    total: 0,
    loading: false,
    error: null
};

const announcementSliceUser = createSlice({
    name: 'announcements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.loading = false;
                // const {
                //     data,
                //     unreadCount,
                //     page,
                //     totalPages,
                //     total
                // } = action.payload;
                state.list = action?.payload?.data;
                state.unreadCount = action?.payload?.count;
                state.page = action?.payload?.page;
                state.totalPages = action?.payload?.totalPages;
                // state.total = total;

                console.log(action?.payload?.data, 'payload++++=')
            })
            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log(action.payload, 'payloaderrooror')
            });
    }
});

export default announcementSliceUser.reducer;
