export type SubLeague = {
  id: string;
  name: string;
  selected: boolean;
};

export type SportCategory = {
  id: string;
  name: string;
  expanded: boolean;
  selected: boolean;
  leagues: SubLeague[];
};

export type FilterBottomSheetRef = {
  open: () => void;
  close: () => void;
};

export type FilterBottomSheetProps = {
  onApply?: (categories: SportCategory[]) => void;
};
