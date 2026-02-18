import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "../features/date/dateSlice";
import filterReducer from "../features/filter/filterSlice";
import matchReducer from "../features/match/matchSlice";

export const store = configureStore({
  reducer: {
    match: matchReducer,
    filter: filterReducer,
    date: dateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
