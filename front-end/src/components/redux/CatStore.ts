import { configureStore } from "@reduxjs/toolkit";
import catReducer from "./CatSlice.ts";

export const store = configureStore({
  reducer: {
    cats: catReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;