import { SportCategory } from "../types/filterTypes";

export const FILTER_CATEGORIES: SportCategory[] = [
  {
    id: "aus-rules",
    name: "Australian Rules",
    expanded: true,
    selected: true,
    leagues: [
      { id: "afl", name: "AFL", selected: true },
      { id: "vfl", name: "VFL", selected: true },
      { id: "wafl", name: "WAFL", selected: true },
    ],
  },
  {
    id: "rugby-league",
    name: "Rugby League",
    expanded: false,
    selected: true,
    leagues: [
      { id: "nrl", name: "NRL", selected: true },
      { id: "super-league", name: "Super League", selected: true },
    ],
  },
  {
    id: "cricket",
    name: "Cricket",
    expanded: false,
    selected: true,
    leagues: [
      { id: "ipl", name: "IPL", selected: true },
      { id: "bbl", name: "BBL", selected: true },
    ],
  },
  {
    id: "mma",
    name: "Mixed Martial Arts",
    expanded: false,
    selected: true,
    leagues: [{ id: "ufc", name: "UFC", selected: true }],
  },
  {
    id: "boxing",
    name: "Boxing",
    expanded: false,
    selected: true,
    leagues: [],
  },
  {
    id: "tennis",
    name: "Tennis",
    expanded: false,
    selected: true,
    leagues: [
      { id: "atp", name: "ATP", selected: true },
      { id: "wta", name: "WTA", selected: true },
    ],
  },
  {
    id: "football",
    name: "Football",
    expanded: false,
    selected: true,
    leagues: [
      { id: "epl", name: "EPL", selected: true },
      { id: "la-liga", name: "La Liga", selected: true },
      { id: "bundesliga", name: "Bundesliga", selected: true },
    ],
  },
  {
    id: "basketball",
    name: "Basketball",
    expanded: false,
    selected: true,
    leagues: [
      { id: "nba", name: "NBA", selected: true },
      { id: "wnba", name: "WNBA", selected: true },
    ],
  },
];
