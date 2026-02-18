import { FilterState } from "@/src/types/filterTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: FilterState = {
  sports: [],
  loading: false,
  error: null,
  selectedTournamentIds: [],
  selectedSportsNames: [],
};

export const fetchSportsFilters = createAsyncThunk(
  "filter/fetchSports",
  async () => {
    const response = await axios.get(
      "https://au.testing.smartb.com.au/soc-api/sports/AllSportsAndLeagues",
    );

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
      if (tournament) tournament.selected = !tournament.selected;
    },

    applyFilters: (state, action: PayloadAction<number[]>) => {
      state.selectedTournamentIds = action.payload;

      const allTournaments = state.sports.flatMap((sport) => sport.tournaments);

      // Sync the selected names from the IDs
      state.selectedSportsNames = action.payload
        .map((id) => allTournaments.find((t) => t.id === id)?.name)
        .filter(Boolean) as string[];

      // Sync the selected state on each tournament to match
      state.sports.forEach((sport) =>
        sport.tournaments.forEach((t) => {
          t.selected = action.payload.includes(t.id);
        }),
      );
    },

    resetSelections: (state) => {
      state.selectedTournamentIds = [];
      state.selectedSportsNames = [];
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

export const { toggleExpand, toggleTournament, resetSelections, applyFilters } =
  filterSlice.actions;

export default filterSlice.reducer;
