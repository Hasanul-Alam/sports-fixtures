import { FilterState } from "@/src/types/filterTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: FilterState = {
  sports: [],
  loading: false,
  error: null,
};

/**
 * Fetch sports and leagues thunk for filter.
 */
export const fetchSportsFilters = createAsyncThunk(
  "filter/fetchSports",
  async () => {
    const response = await axios.get(
      "https://au.testing.smartb.com.au/soc-api/sports/AllSportsAndLeagues",
    );

    // Transform server response to UI model
    return response.data.map((sport: any) => ({
      id: sport.id,
      sportName: sport.sportName,
      expanded: false,
      tournaments: sport.tournaments.map((t: any) => ({
        id: t.id,
        name: t.name,
        selected: false,
      })),
    }));
  },
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    toggleExpand: (state, action: PayloadAction<number>) => {
      const sport = state.sports.find((s) => s.id === action.payload);
      if (sport) sport.expanded = !sport.expanded;
    },

    toggleTournament: (
      state,
      action: PayloadAction<{ sportId: number; tournamentId: number }>,
    ) => {
      const { sportId, tournamentId } = action.payload;

      const sport = state.sports.find((s) => s.id === sportId);
      if (!sport) return;

      const tournament = sport.tournaments.find((t) => t.id === tournamentId);

      if (tournament) {
        tournament.selected = !tournament.selected;
      }
    },

    resetSelections: (state) => {
      state.sports.forEach((sport) =>
        sport.tournaments.forEach((t) => {
          t.selected = false;
        }),
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportsFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.sports = action.payload;
      })
      .addCase(fetchSportsFilters.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load filters";
      });
  },
});

export const { toggleExpand, toggleTournament, resetSelections } =
  filterSlice.actions;

export default filterSlice.reducer;
