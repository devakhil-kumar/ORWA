import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    loginService, loginServiceAdmin, forgotPasswordService, forgotPasswordServiceAdmin,
    verifyOtpService, verifyOtpServiceAdmin, resetPasswordService, resetPasswordServiceAdmin,
    chnageAdminPasswordService,
    chnageResedentialPasswordService
} from "../../apis/service";
import { clearUserData, getUserData, saveUserData } from "../../units/asyncStorageManager";

const getErrorPayload = (error, fallbackMessage = 'Something went wrong') => {
    return error?.response?.data || { message: error?.message || fallbackMessage };
};

export const LoginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await loginService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            saveUserData(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorPayload(error, 'Login failed'));
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
            return rejectWithValue(getErrorPayload(error, 'Login failed'));
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await forgotPasswordService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await verifyOtpService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await resetPasswordService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
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


export const changePasswordAdmin = createAsyncThunk(
    'auth/changePasswordAdmin',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await chnageAdminPasswordService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)
export const changePasswordResedential = createAsyncThunk(
    'auth/changePasswordResedential',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await chnageResedentialPasswordService(userData);
            console.log(response, 'cbsdfbvdsfhvbdvbvh')
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)

const initialState = {
    isLoggedIn: false,
    user: null,
    userRole: null,
    loading: false,
    mainloading: false,
    error: null,
    message: null
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
            state.message = null;
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
                state.message = action.payload?.message;
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
                state.message = action.payload?.message;
                console.log(state.user, state.mesg, 'action')

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
            })

            //forgot password admin
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.message = action.payload?.message;
                console.log(" forgotPAssword : ", action.payload);
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //verify otp user
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.message = action.payload?.message;
                console.log(" verify otp : ", action.payload);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //reset password user
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.message = action.payload?.message;
                console.log(" resetPAssword : ", action.payload);
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //change password admin
            .addCase(changePasswordAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePasswordAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
                console.log(" changePasswordAdmin : ", action.payload);
            })
            .addCase(changePasswordAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //change password resedential
            .addCase(changePasswordResedential.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePasswordResedential.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
                console.log(" changePasswordResedential : ", action.payload);
            })
            .addCase(changePasswordResedential.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { logout, resetAuthError } = authSlice.actions;
export default authSlice.reducer;