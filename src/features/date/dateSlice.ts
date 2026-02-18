import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DateState {
  selectedDate: string | null; // "YYYY-MM-DD" format
}

const initialState: DateState = {
  selectedDate: null,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    resetSelectedDate: (state) => {
      state.selectedDate = null;
    },
  },
});

export const { setSelectedDate, resetSelectedDate } = dateSlice.actions;
export default dateSlice.reducer;
