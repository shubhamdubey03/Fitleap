import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_URL } from '../config/api';

const API_URL = AUTH_URL;

/* -------------------- HELPERS -------------------- */

const saveUser = async (data) => {
    if (data) await AsyncStorage.setItem('user', JSON.stringify(data));
};

const getError = (error) => {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
};


/* -------------------- THUNKS -------------------- */

// Register
// Register User (JSON)
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            console.log(`Sending User signup (JSON) to: ${API_URL}/signup-user`);

            const response = await axios.post(
                `${API_URL}/signup-user`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000,
                }
            );

            await saveUser(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error));
        }
    }
);

// Register Coach (FormData) - SEPARATE THUNK
export const registerCoach = createAsyncThunk(
    'auth/registerCoach',
    async (formData, thunkAPI) => {
        try {
            console.log(`Sending Coach signup (FormData) to: ${API_URL}/signup`);
            console.log("Signup Body:", formData);

            // transform formData to see what's inside (for debugging)
            // Note: logging FormData directly often shows empty object {}

            const response = await axios.post(
                `${API_URL}/signup`,
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data', // Explicitly set for Android, or let Axios handle it? 
                        // Usually letting Axios handle it is best, BUT sometimes React Native needs explicit 'multipart/form-data'
                    },
                    transformRequest: (data, headers) => {
                        // Axios workaround for React Native FormData
                        return data;
                    },
                    timeout: 60000, // 60s for files
                }
            );

            await saveUser(response.data);
            return response.data;
        } catch (error) {
            console.log("Coach Signup Error Detailed:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(getError(error));
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, userData);
            await saveUser(data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error));
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async () => {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
);


// Google Login
export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (idToken, thunkAPI) => {
        try {
            const { data } = await axios.post(`${API_URL}/google`, { idToken });
            await saveUser(data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error));
        }
    }
);

// Update Profile (text + image)
export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ updates, isFormData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
                },
            };

            const { data } = await axios.put(
                `${API_URL}/update-profile`,
                updates,
                config
            );

            const current = JSON.parse(await AsyncStorage.getItem('user')) || {};
            const updated = { ...current, ...data };

            await saveUser(updated);
            return updated;

        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error));
        }
    }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
    await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('userData'),
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('IS_LOGGED_IN'),
        AsyncStorage.removeItem('USER_ROLE'),
        AsyncStorage.removeItem('VENDOR_NAME'),
        AsyncStorage.removeItem('COACH_NAME'),
    ]);
});

/* -------------------- SLICE -------------------- */

const initialState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

const pending = (state) => {
    state.isLoading = true;
};

const fulfilled = (state, action) => {
    state.isLoading = false;
    state.isSuccess = true;
    state.user = action.payload;
};

const rejected = (state, action) => {
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload;
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, pending)
            .addCase(register.fulfilled, fulfilled)
            .addCase(register.rejected, rejected)

            .addCase(registerCoach.pending, pending)
            .addCase(registerCoach.fulfilled, fulfilled)
            .addCase(registerCoach.rejected, rejected)

            .addCase(login.pending, pending)
            .addCase(login.fulfilled, fulfilled)
            .addCase(login.rejected, rejected)

            .addCase(googleLogin.pending, pending)
            .addCase(googleLogin.fulfilled, fulfilled)
            .addCase(googleLogin.rejected, rejected)

            .addCase(updateUserProfile.pending, pending)
            .addCase(updateUserProfile.fulfilled, fulfilled)
            .addCase(updateUserProfile.rejected, rejected)

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isSuccess = true;
            });


    },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;
