import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unreadCount: 0,
    notifications: [],
};

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        increment: (state) => {
            state.unreadCount += 1;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        reset: (state) => {
            state.unreadCount = 0;
        },
        setCount: (state, action) => {
            state.unreadCount = action.payload;
        },
    },
});

// Force HMR Update
export const { increment, reset, setCount, addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
