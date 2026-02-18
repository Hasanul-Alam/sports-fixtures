export interface Tournament {
  id: number;
  name: string;
  selected: boolean;
}

export interface SportCategory {
  id: number;
  sportName: string;
  expanded: boolean;
  tournaments: Tournament[];
}

export interface FilterState {
  sports: SportCategory[];
  loading: boolean;
  error: string | null;
  selectedTournamentIds: number[];
  selectedSportsNames: string[];
}
