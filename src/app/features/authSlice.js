import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginService, loginServiceAdmin } from "../../apis/service";
import { clearUserData, getUserData, saveUserData } from "../../units/asyncStorageManager";

export const LoginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await loginService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            saveUserData(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)

export const loginAdmin = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await loginServiceAdmin(userData);
            saveUserData(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)


export const loadInitialState = createAsyncThunk(
    'auth/loadInitialState',
    async () => {
        try {
            const storedData = await getUserData();
            const { user, userRole, token } = storedData || {};
            return {
                user: user || null,
                userRole: userRole || null,
                token: token || null,
                isLoggedIn: !!token,
            };
        } catch (error) {
            console.error('Error in loadInitialState:', error);
            throw error;
        }
    }
);

const initialState = {
    isLoggedIn: false,
    user: null,
    userRole: null,
    loading: false,
    mainloading: false,
    error: null,
    // mesg:null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            clearUserData();
            state.isLoggedIn = false;
            state.user = null;
            state.userRole = null;
            state.token = null;
            console.log('User logged out successfully.');
        },
        resetAuthError: (state) => {
            state.error = null;
            state.mesg = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.user = action.payload.data;
                state.userRole = action.payload?.data?.role;
                state.token = action.payload?.data?.token;
                // state.mesg = action.payload?.message;
                console.log(action.payload, 'action')
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.user = action.payload.data;
                state.userRole = action.payload?.data?.role;
                state.token = action.payload?.data?.token;
                // state.mesg = action.payload?.message;
                console.log(state.user,state.mesg, 'action')
                
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loadInitialState.pending, (state) => {
                state.mainloading = true;
            })
            .addCase(loadInitialState.fulfilled, (state, action) => {
                state.mainloading = false;
                state.isLoggedIn = action.payload.isLoggedIn;
                state.user = action.payload.data;
                state.userRole = action.payload?.userRole;
                state.token = action.payload.token;
            })
            .addCase(loadInitialState.rejected, (state) => {
                state.mainloading = false;
                state.isLoggedIn = false;
            });
    },
});

export const { logout, resetAuthError } = authSlice.actions;
export default authSlice.reducer;
