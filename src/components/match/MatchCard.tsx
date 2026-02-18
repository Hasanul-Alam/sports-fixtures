import React from "react";
import { Text, View } from "react-native";
import TeamAvatar from "./TeamAvatar";
import CountdownTimer from "./coundownTimer";

const BASE_URL = "https://your-api-domain.com/"; // 🔥 Replace with your real API base URL

type MatchProps = {
  match: {
    id: number;
    start_time: string;
    status: string;
    display_status: string;
    format: string;
    competition_scope: string;
    homeTeam: {
      id: number;
      name: string;
      logo: string | null;
    };
    awayTeam: {
      id: number;
      name: string;
      logo: string | null;
    };
    tournament: {
      id: number;
      name: string;
    };
    expertSportEvents: any[];
  };
};

const MatchCard = ({ match }: MatchProps) => {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  const matchDate = new Date(match.start_time);

  const formattedTime = matchDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = matchDate.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });

  const homeLogo = match.homeTeam?.logo
    ? `${BASE_URL}${match.homeTeam.logo}`
    : null;

  const awayLogo = match.awayTeam?.logo
    ? `${BASE_URL}${match.awayTeam.logo}`
    : null;

  return (
    <View className="bg-white mx-4 mb-3 rounded-2xl border border-gray-100 overflow-hidden">
      {/* Tournament */}
      <View className="pt-3 pb-1 items-center">
        <Text className="text-xs font-bold tracking-widest uppercase text-gray-500">
          {match.tournament?.name}
        </Text>
      </View>

      {/* Time */}
      <Text className="text-center text-2xl font-bold text-gray-900">
        {formattedTime}
      </Text>

      <Text className="text-center text-xs text-gray-400 mb-1">
        {formattedDate}
      </Text>

      {/* Status / Countdown / Tips */}
      <View className="items-center mb-2" style={{ gap: 4 }}>
        {isLive && (
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-xs font-semibold text-red-500">
              {match.display_status || "Live"}
            </Text>
          </View>
        )}

        {isUpcoming && <CountdownTimer targetDate={match.start_time} />}

        {match.expertSportEvents?.length > 0 && (
          <View className="bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
            <Text className="text-blue-600 text-xs font-semibold">
              Tips Available
            </Text>
          </View>
        )}
      </View>

      {/* Teams */}
      <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
        {/* Home Team */}
        <View className="items-center flex-1">
          <TeamAvatar name={match.homeTeam?.name} logo={homeLogo} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.homeTeam?.name}
          </Text>
        </View>

        <Text className="text-gray-300 text-lg px-2">vs</Text>

        {/* Away Team */}
        <View className="items-center flex-1">
          <TeamAvatar name={match.awayTeam?.name} logo={awayLogo} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.awayTeam?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MatchCard;
