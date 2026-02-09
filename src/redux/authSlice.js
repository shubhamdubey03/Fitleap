import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_URL } from '../config/api';

// API URL - Centralized
const API_URL = AUTH_URL;

// Register User
export const register = createAsyncThunk(
    'auth/register',
    async ({ userData, role }, thunkAPI) => {
        try {
            const endpoint = role === 'user' ? '/signup-user' : '/signup';
            console.log(`Attempting Register (${role}):`, `${API_URL}${endpoint}`);

            const headers = role === 'user'
                ? { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                : { 'Accept': 'application/json' }; // FormData needs undefined Content-Type

            // Use fetch instead of axios for FormData reliability in React Native
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                body: role === 'user' ? JSON.stringify(userData) : userData,
                headers: headers,
            });

            console.log('Response Status:', response.status);

            const data = await response.json();

            if (!response.ok) {
                // Throw error to be caught by catch block
                const error = new Error(data.message || 'Registration failed');
                error.response = { data: data, status: response.status };
                throw error;
            }

            console.log('Register Success:', data);
            if (data) {
                await AsyncStorage.setItem('user', JSON.stringify(data));
            }
            return data;
        } catch (error) {
            console.error('Register API Error:', error);
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login User
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            if (response.data) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Google Login
export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (idToken, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/google`, { idToken });
            if (response.data) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('IS_LOGGED_IN');
    await AsyncStorage.removeItem('USER_ROLE');
    await AsyncStorage.removeItem('VENDOR_NAME');
    await AsyncStorage.removeItem('COACH_NAME');
});

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
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
            state.isSuccess = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;
