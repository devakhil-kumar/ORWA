import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { announcementAdminService, addEventService, adminEventUpdateService, adminEventDeleteService } from '../../apis/service';

// Async Thunks
export const fetchEventsAdmin = createAsyncThunk(
    'eventAdmin/fetchEvents',
    async ({ isActive, page, limit }, { rejectWithValue }) => {
        try {
            const response = await announcementAdminService(isActive, page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addEvent = createAsyncThunk(
    'eventAdmin/addEvent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await addEventService(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateEvent = createAsyncThunk(
    'eventAdmin/updateEvent',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const response = await adminEventUpdateService(id, payload);
            return {
                data: response?.event || response,
                message: response.message || 'Event updated successfully'
            };
        } catch (error) {
            console.log(error, 'rescblsdchlbvfdjvndflvljbvjhvbfjhvbfdbjhv')
            return rejectWithValue(error || { message: 'Failed to update event' });
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'eventAdmin/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await adminEventDeleteService(id);
            console.log(response, 'delete response+++++++++++++++++')
            return { id, data: response };
        } catch (error) {
            console.log(error, 'delete error')
            return rejectWithValue(error.response?.data || { message: 'Failed to delete event' });
        }
    }
);

const initialState = {
    events: [],
    currentEvent: null,
    loading: false,
    addloading: false,
    deleteLoading: false,
    error: null,
    success: false,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
    updateLoading: false
};

const eventAdminSlice = createSlice({
    name: 'eventAdmin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
        },
        resetEventState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Events
        builder
            .addCase(fetchEventsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.data || action.payload;
                state.pagination = {
                    page: action.payload.page || state.pagination.page,
                    limit: action.payload.limit || state.pagination.limit,
                    total: action.payload.total || state.pagination.total,
                };
            })
            .addCase(fetchEventsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Add Event
        builder
            .addCase(addEvent.pending, (state) => {
                state.addloading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.addloading = false;
                state.success = true;
                state.events.unshift(action.payload); // Add new event to beginning
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.addloading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Update Event
        builder
            .addCase(updateEvent.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                console.log(action.payload, 'vjdlfjvdflvbvdhjfbvdjhvfbvfdj')
                state.updateLoading = false;
                state.success = true;
                const updatedEvent = action.payload.data;
                const index = state.events.findIndex(
                    (event) => event._id === updatedEvent._id || event.id === updatedEvent.id
                );
                if (index !== -1) {
                    state.events[index] = updatedEvent;
                }
                if (state.currentEvent?._id === updatedEvent._id) {
                    state.currentEvent = updatedEvent;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                console.log(action.payload, 'vjdlfjvdflvbvdhjfbvdjhvfbvfdj')
                state.updateLoading = false;
                state.error = action.payload;
                state.success = false;
            });

        builder
            .addCase(deleteEvent.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;
                state.events = state.events.filter(
                    (event) => event._id !== action.payload.id && event.id !== action.payload.id
                );
                if (state.currentEvent?._id === action.payload.id || state.currentEvent?.id === action.payload.id) {
                    state.currentEvent = null;
                }
                if (state.pagination.total > 0) {
                    state.pagination.total -= 1;
                }
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess, setCurrentEvent, resetEventState } = eventAdminSlice.actions;

export default eventAdminSlice.reducer;