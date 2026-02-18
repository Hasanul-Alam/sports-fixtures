import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchState {
  matches: any[];
  loading: boolean;
}

const initialState: MatchState = {
  matches: [],
  loading: false,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<any[]>) => {
      state.matches = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    appendMatches: (state, action) => {
      state.matches = [...state.matches, ...action.payload]; // adds to existing
    },
  },
});

export const { setMatches, setLoading, appendMatches } = matchSlice.actions;
export default matchSlice.reducer;
