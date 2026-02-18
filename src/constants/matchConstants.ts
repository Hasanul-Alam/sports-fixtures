import { Match } from "../types/matchTypes";

export const MATCHES: Match[] = [
  {
    id: "1",
    league: "NBA",
    time: "11:00AM",
    timeLeft: "0m 5s",
    homeTeam: "Portland Trail Blazers",
    awayTeam: "Golden State Warriors",
    isLive: true,
  },
  {
    id: "2",
    league: "NRL",
    time: "11:15AM",
    timeLeft: "8m 45s",
    homeTeam: "St. George Illawarra Dragons",
    awayTeam: "Canterbury-Bankstown Bulldogs",
    hasTips: true,
    isLive: true,
  },
  {
    id: "3",
    league: "AFL",
    time: "11:20AM",
    timeLeft: "13m 45s",
    homeTeam: "Greater Western Sydney Giants",
    awayTeam: "North Melbourne Kangaroos",
    hasTips: true,
    isLive: true,
  },
  {
    id: "4",
    league: "AUSTRALIAN OPEN",
    time: "11:25AM",
    timeLeft: "18m 45s",
    homeTeam: "Djokovic N.",
    awayTeam: "Zverev A.",
    isLive: true,
  },
  {
    id: "5",
    league: "NFL",
    time: "11:05AM",
    odds: "23/1",
    homeTeam: "San Francisco 49ers",
    awayTeam: "Detroit Lions",
  },
  {
    id: "6",
    league: "EPL",
    time: "11:10AM",
    homeTeam: "Arsenal FC",
    awayTeam: "Leicester FC",
  },
];

export const SPORT_FILTERS = ["All", "Australian Rules", "Rugby League"];

export const LEAGUE_COLORS: Record<string, string> = {
  NBA: "#C8102E",
  NRL: "#003087",
  AFL: "#002B5C",
  "AUSTRALIAN OPEN": "#0098D4",
  NFL: "#013369",
  EPL: "#38003C",
};
