import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Cat } from "../CatViewer"; 


interface PinState {
  cats: Cat[];
}

const initialState: PinState = {
  cats: [],
};

const catsSlice = createSlice({
  name: "cats",
  initialState,
  reducers: {
    addCat: (state, action: PayloadAction<Cat>) => {
      state.cats.push(action.payload);
    },
    removeCat: (state, action: PayloadAction<string>) => {
      state.cats = state.cats.filter((cat) => cat.id !== action.payload);
    },
  },
});

export const { addCat, removeCat } = catsSlice.actions;
export default catsSlice.reducer;