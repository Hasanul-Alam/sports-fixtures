export type Match = {
  id: string;
  league: string;
  time: string;
  timeLeft?: string;
  homeTeam: string;
  awayTeam: string;
  odds?: string;
  hasTips?: boolean;
  isLive?: boolean;
};
