import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import hardwareReducer from './hardwareSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    hardware: hardwareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
