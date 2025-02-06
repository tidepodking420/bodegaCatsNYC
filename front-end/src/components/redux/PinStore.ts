import { configureStore } from "@reduxjs/toolkit";
import pinReducer from "./PinSlice.ts";

export const store = configureStore({
  reducer: {
    pins: pinReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;