export type Match = {
  id: string;
  tournament: {
    id: number;
    name: string;
  };
  league: string;
  time: string;
  timeLeft?: string;
  homeTeam: Team;
  awayTeam: Team;
  odds?: string;
  hasTips?: boolean;
  isLive?: boolean;
};

export type Team = {
  id: number;
  name: string;
  logo: string;
};
