import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Pin } from "../Map"; 


interface PinState {
  pins: Pin[];
}

const initialState: PinState = {
  pins: [],
};

const pinsSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<Pin>) => {
      state.pins.push(action.payload);
    },
    removePin: (state, action: PayloadAction<number>) => {
      state.pins = state.pins.filter((pin) => pin.id !== action.payload);
    },
  },
});

export const { addPin, removePin } = pinsSlice.actions;
export default pinsSlice.reducer;